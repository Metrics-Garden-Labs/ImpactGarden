import { useState } from 'react';
import { EIP712AttestationParams, EAS, SchemaEncoder, ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
import { useEAS, useSigner } from '@/src/hooks/useEAS';
import { usePinataUpload } from './usePinataUpload'; // Assuming you place both hooks in the same folder
import useLocalStorage from './use-local-storage-state';

export const useCreateAttestation = () => {
  const { eas, currentAddress } = useEAS();
  const signer = useSigner();
  const [user] = useLocalStorage('user', {
    fid: '',
    username: '',
    ethAddress: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const createAttestation = async (metadata: any, schema: string, project: any, formData: any) => {
    setIsCreating(true);
    const { pinataUpload } = usePinataUpload();

    if (!user.fid) {
      alert('User not logged in');
      return '';
    }
    if (!eas || !currentAddress) {
      alert('Please connect your wallet to continue');
      return '';
    }
    if (!signer) {
      console.error('Signer not available');
      return '';
    }

    const pinataURL = await pinataUpload(metadata);
    if (!pinataURL) return '';

    try {
      const schemaEncoder = new SchemaEncoder(
        'bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL'
      );

      const encodedData = schemaEncoder.encodeData([
        { name: 'projectRefUID', value: project.projectUid || '', type: 'bytes32' },
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'name', value: formData.contribution || '', type: 'string' },
        { name: 'category', value: formData.category || '', type: 'string' },
        { name: 'parentProjectRefUID', value: project.primaryprojectuid || '', type: 'bytes32' },
        { name: 'metadataType', value: '0', type: 'uint8' },
        { name: 'metadataURL', value: pinataURL, type: 'string' },
      ]);

      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);

      const attestationData: EIP712AttestationParams = {
        schema,
        recipient: project.ethAddress || '',
        expirationTime: 0n,
        revocable: true,
        refUID: project.primaryprojectuid || ZERO_BYTES32,
        data: encodedData,
        value: 0n,
        deadline: 0n,
        nonce: await easop.getNonce(currentAddress),
      };

      const signDelegated = await easop.getDelegated().signDelegatedAttestation(attestationData, signer);

      const dataToSend = {
        ...attestationData,
        signature: signDelegated.signature,
        attester: currentAddress,
      };

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend, (key, value) =>
          typeof value === 'bigint' ? '0x' + value.toString(16) : value
        ),
      });
      const responseData = await response.json();

      if (responseData.success) {
        return responseData.attestationUID;
      } else {
        throw new Error(`Failed to create attestation, Error: ${responseData.error}`);
      }
    } catch (error: any) {
      if (error.code === 4001) {
        alert('Transaction was rejected by the user.');
      } else {
        alert('An error occurred while creating attestation. Please try again.');
      }
      console.error('Error in createAttestation:', error);
      return '';
    } finally {
      setIsCreating(false);
    }
  };

  return { createAttestation, isCreating };
};
