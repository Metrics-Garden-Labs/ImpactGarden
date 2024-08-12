import { useState } from 'react';
import { EIP712AttestationParams, EAS, SchemaEncoder, ZERO_ADDRESS, NO_EXPIRATION, ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
import pinataSDK from '@pinata/sdk';
import { isAddress } from 'ethers';
import { Contribution, Project } from '@/src/types';
import { useSigner, useEAS } from './useEAS';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import { set } from 'zod';

export const useContributionAttestation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attestationUID, setAttestationUID] = useState<string>('');
  const signer = useSigner();
  const { eas, currentAddress } = useEAS();

  const pinataUpload = async (compiledData: any): Promise<string> => {
    setIsLoading(true);
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY });

    try {
      console.log('Uploading to Pinata:', compiledData);
      const res = await pin.pinJSONToIPFS(compiledData);
      console.log('Pinata response:', res);
      if (!res || !res.IpfsHash) {
        throw new Error('Invalid response from Pinata');
      }
      const pinataURL = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      console.log('Pinata URL:', pinataURL);
      return pinataURL;
    } catch (error) {
      console.error('Failed to upload to pinata:', error);
      throw new Error('Failed to upload to Pinata');
    }
  };

  const createAttestation = async (pinataURL: string, contribution: Contribution, project: Project, user: any): Promise<string> => {
    if (!user.fid) {
      throw new Error('User not logged in');
    }

    if (!eas || !currentAddress) {
      throw new Error('Please connect your wallet to continue');
    }

    if (!signer) {
      throw new Error('Signer not available');
    }

    const recipientAddress = project.ethAddress && isAddress(project.ethAddress) ? project.ethAddress : ZERO_ADDRESS;

    try {
      console.log('Creating attestation with URL:', pinataURL);
      const schema = "0xc9bc703e3c48be23c1c09e2f58b2b6657e42d8794d2008e3738b4ab0e2a3a8b6";
      const schemaEncoder = new SchemaEncoder(
        'bytes32 contributionRegUID, bytes32 projectRegUID, uint256 farcasterID, string issuer, string metadataurl'
      );
      const encodedData = schemaEncoder.encodeData([
        { name: 'contributionRegUID', type: 'bytes32', value: contribution.primarycontributionuid || "" },
        { name: 'projectRegUID', type: 'bytes32', value: project.primaryprojectuid || "" },
        { name: 'farcasterID', type: 'uint256', value: user.fid },
        { name: 'issuer', type: 'string', value: "MGL" },
        { name: 'metadataurl', type: 'string', value: pinataURL },
      ]);
      console.log('Encoded data for attestation:', encodedData);
      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
      const delegatedSigner = await easop.getDelegated();
      const easnonce = await easop.getNonce(currentAddress);

      const attestationData: EIP712AttestationParams = {
        schema: schema,
        recipient: recipientAddress,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: contribution.primarycontributionuid || contribution.easUid || ZERO_BYTES32,
        data: encodedData,
        value: 0n,
        deadline: NO_EXPIRATION,
        nonce: easnonce,
      };

      const signDelegated = await delegatedSigner.signDelegatedAttestation(attestationData, signer);
      console.log('Signed attestation data:', signDelegated);
      attestationData.data = encodedData;
      const signature = signDelegated.signature;

      const dataToSend = {
        ...attestationData,
        signature: signature,
        attester: currentAddress,
      };
      console.log('Data to send:', dataToSend);

      const serializedData = JSON.stringify(dataToSend, (key, value) =>
        typeof value === 'bigint' ? '0x' + value.toString(16) : value
      );

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serializedData,
      });
      const responseData = await response.json();
      console.log('Delegate attestation response:', responseData);

      if (responseData.success) {
        setAttestationUID(responseData.attestationUID);
        return responseData.attestationUID;
      } else {
        throw new Error(`Failed to create attestation, Error: ${responseData.error}`);
      }
    } catch (error: any) {
      console.error('Error in createAttestation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    attestationUID,
    pinataUpload,
    createAttestation,
  };
};
