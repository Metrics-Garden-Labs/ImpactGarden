// hooks/useDelegatedAttestation.ts
import { useState } from 'react';
import { EAS, SchemaEncoder, EIP712AttestationParams } from '@ethereum-attestation-service/eas-sdk';
import { useSigner } from '../../src/hooks/useEAS';
import { NEXT_PUBLIC_URL } from '../../src/config/config';

export const useDelegatedAttestation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const signer = useSigner();

  const createDelegatedAttestation = async (
    schema: string,
    data: string,
    recipient: string,
    refUID: string,
    expirationTime: bigint = BigInt(0),
    revocable: boolean = true
  ) => {
    setIsCreating(true);
    try {
      if (!signer) {
        throw new Error('Signer is not available');
      }

      const eas = new EAS('0x4200000000000000000000000000000000000021');
      eas.connect(signer);

      const delegatedSigner = await eas.getDelegated();
      const currentAddress = await signer.getAddress();
      const nonce = await eas.getNonce(currentAddress);

      const eip712Data: EIP712AttestationParams = {
        schema,
        data,
        recipient,
        refUID,
        expirationTime,
        revocable,
        value: BigInt(0),
        nonce,
        deadline: BigInt(0), // NO_EXPIRATION
      };

      const signDelegated = await delegatedSigner.signDelegatedAttestation(eip712Data, signer);

      const finalAttestationData = {
        ...eip712Data,
        signature: signDelegated.signature,
        attester: currentAddress,
      };

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAttestationData, (_, v) => typeof v === 'bigint' ? v.toString() : v),
      });

      const responseData = await response.json();
      if (!responseData.success) throw new Error(responseData.error);

      return responseData.attestationUID;
    } catch (error) {
      console.error('Failed to create delegated attestation:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createDelegatedAttestation, isCreating };
};