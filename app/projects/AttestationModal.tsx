'use client ';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Contribution, Project } from '@/src/types'; 
import { NEXT_PUBLIC_URL } from '@/src/config/config'; 
import { useGlobalState } from '@/src/config/config'; 
import { LuArrowUpRight } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';

interface AttestationModalProps {
    isOpen: boolean;
    onClose: () => void;
    contribution: Contribution;
    project: Project;
    currentAddress: string;
    eas: EAS | null;
}

const AttestationModal: React.FC<AttestationModalProps> = ({
    isOpen,
    onClose,
    contribution,
    project,
    currentAddress,
    eas
}) => {
    const [isUseful, setIsUseful] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [attestationCount, setAttestationCount] = useState(0);
    const [walletAddress] = useGlobalState('walletAddress');
    const [fid] = useGlobalState('fid');
    const [selectedProject] = useGlobalState('selectedProject');

    const createAttestation = async () => {
        if (!eas || !currentAddress) {
            console.error('EAS or current address not available');
            return;
        }

        try {
            const attestationSchema = "0x0ea974daef377973de71b8a206247f436f67364853a10d460c2623d18035db12";
            const schemaEncoder = new SchemaEncoder('string Contribution, bool Useful, string Feedback');
            const encodedData = schemaEncoder.encodeData([
                { name: 'Contribution', type: 'string', value: contribution.contribution },
                { name: 'Useful', type: 'bool', value: isUseful }, 
                { name: 'Feedback', type: 'string', value: feedback },
            ]);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer =  await provider.getSigner();
            const easop = new EAS('0x4200000000000000000000000000000000000021'); // Ensure you have the correct contract address for your EAS instance
            easop.connect(signer);
            const delegatedSigner = await easop.getDelegated();
            const easnonce = await easop.getNonce(currentAddress);

            const attestation: EIP712AttestationParams = {
                schema: attestationSchema,
                recipient: project.ethAddress,
                expirationTime: BigInt(9973891048),
                revocable: true,
                refUID: contribution.easUid || '',
                data: encodedData,
                value: BigInt(0),
                deadline: BigInt(9973891048),
                nonce: easnonce,
            };

            const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);

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
     
            } else {
              console.error('Failed to retrieve attestation UID from the API response');
            }
    
            const newAttestation = {
              userFid: fid,
              projectName: selectedProject?.projectName,
              contribution: contribution.contribution,
              ecosystem: selectedProject?.ecosystem,
              attestationUID: responseData.attestationUID,
              attesterAddy: walletAddress,
              feedback: feedback,
              attestationType: isUseful ? 'Useful' : 'Not Useful',
            }
       
            const response1 = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionAttestationDb`, {
              method: 'POST',
              body: JSON.stringify(newAttestation),
              headers: {
                'Content-Type': 'application/json',
              },
            });
       
            const dbResponse = await response1.json();
            console.log('DB Response, insert attestation success:', dbResponse);
          } catch (error) {
            console.error('Error creating attestation/ adding to db:', error);
          }
        };

            // Additional logic to handle the response, display errors, etc.
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div 
                className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-1/4 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">{contribution.contribution}</h2>
          </div>
          <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
          <div className="mb-4 items-center py-3 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-center">Description</h3>
            <p className='text-left'>{contribution.desc}</p>
          </div>
          <div className="mb-4 ">
            <h3 className="font-semibold text-center">Link/Evidence</h3> 
            <a href={contribution.link} className="text-gray-500 text-left hover:text-gray-300 visited:text-indigo-600 flex items-center">
                {contribution.link}
                <LuArrowUpRight className="ml-1" />
                </a>
          </div>
          {/* <div className="mb-4 ">
            <h3 className="font-semibold text-center">Attestations</h3>
            <p>Info on who has attested and maybe some more stuff</p>
          </div> */}
          <div className='mb-4'>
            <h3 className='font-semibold text-center'>Attestations</h3>
            <p className='text-center'>
              This contribution has been attested to {attestationCount} times
            </p>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isUseful}
                onChange={(e) => setIsUseful(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Useful Contribution</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Feedback:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
            ></textarea>
          </div>
          <div className='mb-4 text-center py-3'>
          <button className='btn text-center bg-headerblack text-white hover:bg-blue-500'
            onClick={createAttestation}>
            Attest to this Contribution
          </button>
          </div>
          <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
          <RxCross2 className='w-5 h-5'/>
            </button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AttestationModal;
