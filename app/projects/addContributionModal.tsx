// AddContributionModal.tsx
'use client';
import React, { useState } from 'react';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../src/config/config';
import { Contribution } from '../../src/types';
import { useEAS } from '../../src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { estimateGasQueryOptions } from 'wagmi/query';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: Contribution) => Promise<void>;
}

export default function AddContributionModal({ isOpen, onClose,}: Props) {
  const [fid] = useGlobalState('fid');
  const [walletAddress] = useGlobalState('walletAddress');
  const [selectedProject] = useGlobalState('selectedProject');
  const [formData, setFormData] = useState<Contribution>({
    userFid: fid,
    projectName: selectedProject?.projectName || '',
    ecosystem: selectedProject?.ecosystem || '',
    contribution: '',
    desc: '',
    link: '',
    easUid: '',
    ethAddress: walletAddress,
  });

  const { eas, currentAddress } = useEAS();

  const createAttestation = async (): Promise<string | null> => {
    if (!eas || !currentAddress) {
      console.error('EAS not initialized');
      return null;
    }

    try {
      const contributionSchema = '0x132a4d5644fa6b85baf205fc25b069ba398bcecea7dc4b609c2ba20efb71da90';
      const schemaEncoder = new SchemaEncoder('uint24 userFid, string projectName, string contribution, string description, string link, string ecosystem');
      const encodedData = schemaEncoder.encodeData([
        { name: 'userFid', type: 'uint24', value: fid },
        { name: 'projectName', type: 'string', value: selectedProject?.projectName || '' },
        { name: 'contribution', type: 'string', value: formData.contribution },
        { name: 'description', type: 'string', value: formData.desc },
        { name: 'link', type: 'string', value: formData.link },
        { name: 'ecosystem', type: 'string', value: selectedProject?.ecosystem || '' },
      ]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
      const delegatedSigner = await easop.getDelegated();
      console.log('Delegated Signer:', delegatedSigner);

      const easnonce = await easop.getNonce(walletAddress);
      console.log('EAS Nonce:', easnonce);

      const attestation: EIP712AttestationParams = {
        schema: contributionSchema,
        recipient: walletAddress,
        expirationTime: BigInt(9973891048),
        revocable: true,
        refUID: selectedProject?.projectUid || '',
        data: encodedData,
        value: BigInt(0),
        deadline: BigInt(9973891048),
        nonce: easnonce,
      };
      console.log('Attestation:', attestation);

      const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);
      console.log('Delegated Signature:', signDelegated);

      attestation.data = encodedData;
      const signature = signDelegated.signature;

      const dataToSend = {
        ...attestation,
        signature: signature,
        attester: walletAddress,
      };

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
      console.log('Response:', responseData);

      if (responseData.success && responseData.attestationUID) {
        console.log('Attestation UID:', responseData.attestationUID);
        return responseData.attestationUID;
      } else {
        console.error('Failed to retrieve attestation UID from the API response');
      }
    } catch (error) {
      console.error('Error creating attestation:', error);
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addContribution(formData);
    onClose();
  };

  const addContribution = async (contribution: Contribution) => {
    try {
      // Create the attestation
      const attestationUID = await createAttestation();

      if (attestationUID) {
        // Update the form data with the attestation UID
        const updatedContribution = { ...contribution, easUid: attestationUID };

        // Submit the form data to the API
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionDb`, {
          method: 'POST',
          body: JSON.stringify(updatedContribution),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to add contribution');
          return;
        }

        console.log('Contribution added successfully', response);
        // Reload the window to show the new contribution
        // Maybe not the best as it signs me out of the app, gotta figure that out.
      } else {
        console.error('Failed to create attestation');
      }
    } catch (error) {
      console.error('Failed to add contribution', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
        <h2>Add New Contribution</h2>
        <input
          value={formData.contribution}
          onChange={e => setFormData({ ...formData, contribution: e.target.value })}
          placeholder="Contribution Title"
          required
        />
        <textarea
          value={formData.desc}
          onChange={e => setFormData({ ...formData, desc: e.target.value })}
          placeholder="Description"
        />
        <input
          value={formData.link}
          onChange={e => setFormData({ ...formData, link: e.target.value })}
          placeholder="Link/Evidence"
        />
        <button
          className="btn"
          type="button"
          onClick={async () => {
            await addContribution(formData);
            onClose();
          }}
        >
          Add Contribution
        </button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}