// hooks/useNormalAttestation.ts
import { useState } from 'react';
import { EAS, SchemaEncoder, AttestationRequestData } from '@ethereum-attestation-service/eas-sdk';
import { useSigner } from './useEAS';
import { NEXT_PUBLIC_URL } from '../config/config';

export const useNormalAttestation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const signer = useSigner();

  const createNormalAttestation = async (
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

      const attestationData: AttestationRequestData = {
        data,
        recipient,
        refUID,
        expirationTime,
        revocable,
        value: BigInt(0),
      };

      const dataToSend = {
        schema,
        ...attestationData
      }

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/projectAttestation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend, (_, v) => typeof v === 'bigint' ? v.toString() : v),
      });

      const responseData = await response.json();
      if (!responseData.success) throw new Error(responseData.error);

      return responseData.attestationUID;
    } catch (error) {
      console.error('Failed to create normal attestation:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createNormalAttestation, isCreating };
};