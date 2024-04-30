// AddContributionModal.tsx
'use client';
import React, { useState } from 'react';
import { NEXT_PUBLIC_URL, useGlobalState } from '@/src/config/config';
import { Contribution } from '@/src/types';
import { useEAS } from '@/src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { estimateGasQueryOptions } from 'wagmi/query';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: Contribution) => Promise<void>;
}



export default function AddContributionModal({ isOpen, onClose, addContribution }: Props) {

    const [fid] = useGlobalState('fid');
    const [ walletAddress] = useGlobalState('walletAddress');
    const [selectedProject] = useGlobalState('selectedProject');
    const [formData, setFormData] = useState<Contribution>({
        userFid: fid,
        projectName: selectedProject?.projectName || '',
        ecosystem: selectedProject?.ecosystem || '', 
        contribution: '', 
        desc: '', 
        link: '', 
        easUid: '',
        ethAddress: walletAddress});
    //hard coding the ecosystem for now

    const { eas, currentAddress} = useEAS();

    const createAttestation = async () => {
        if(!eas || !currentAddress) {
            console.error('EAS not initialized');
            return;
        }

        try{
            const contributionSchema = '0x132a4d5644fa6b85baf205fc25b069ba398bcecea7dc4b609c2ba20efb71da90';
            const schemaEncoder = new SchemaEncoder('uint24 userFid, string projectName, string contribution, string description, string link, string ecosystem)')
            const encodedData = schemaEncoder.encodeData([
                {name: 'userFid', type: 'uint24', value: fid},
                {name: 'projectName', type: 'string', value: selectedProject?.projectName || ''},
                {name: 'contribution', type: 'string', value: formData.contribution},
                {name: 'description', type: 'string', value: formData.desc},
                {name: 'link', type: 'string', value: formData.link},
                {name: 'ecosystem', type: 'string', value: selectedProject?.ecosystem || ''}
            ]);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            //just incase the eas hook defaault doesnt use OP
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
                refUID: '0xee0d0c8ab4f0f54c3314e935fa9315113a7bdf67d2d00127a26c43685c21632a',
                //change this to the attestation of the project, figure out how to get that in, will hard code atm
                data: encodedData,
                value: BigInt(0),
                deadline: BigInt(9973891048),
                nonce: easnonce,
            };
            console.log('Attestation:', attestation);

            const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);
            console.log('Delegated Signature:', signDelegated);

            attestation.data = encodedData;
            const signature = signDelegated.signature
            
            const dataToSend = {
                ...attestation,
                signature: signature,
                attester: walletAddress,
            };

            const serializedData = JSON.stringify(dataToSend, (key, value) => 
                typeof value === 'bigint' ? "0x" + value.toString(16) : value
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
            console.log('Attestation UID:', responseData.attestationUID);

            if (responseData.success) {
                console.log('Attestation UID:', responseData.attestationUID);
                // Now you can set the easUid with the received attestation UID
                setFormData({...formData, easUid: responseData.attestationUID});
            }
        } catch (error) {
            console.error('Error creating attestation:', error);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addContribution(formData);
    onClose();
    };

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
        <h2>Add New Contribution</h2>
        {/* Input fields for contribution details */}
        {/* at some point the projectname will be passed in as a prop, same with eth address 
        project name is now dynamic and doesnt have to be added manually*/}
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
        <button  className='btn' type="submit">Add Contribution</button>
        <button onClick={onClose}>Cancel</button>
        </form>
    </div>
    );
}
