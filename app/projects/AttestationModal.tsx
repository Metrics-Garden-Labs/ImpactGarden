'use client ';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Contribution, Project } from '@/src/types'; 
import { NEXT_PUBLIC_URL } from '@/src/config/config'; 
import { useGlobalState } from '@/src/config/config'; 
import { LuArrowUpRight } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import Link from 'next/link';
import useLocalStorage from '@/src/hooks/use-local-storage-state';

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
    const [ isLoading, setIsLoading ] = useState(false);
    const [ attestationUID, setAttestationUID ] = useState<string>("");
    const [user] = useLocalStorage( "user", {
        fid: '',
        username: '',
        ethAddress: '',
    });

    const createAttestation = async () => {

        if (!user.fid) {
            alert('User not logged in');
            return;
        }
        if (!eas || !currentAddress) {
            console.error('EAS or current address not available');
            return;
        }

        try {
            setIsLoading(true);
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
                setAttestationUID(responseData.attestationUID);
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
          } finally {
            setIsLoading(false);
          }
        };

            // Additional logic to handle the response, display errors, etc.
    if (!isOpen) return null;

    const renderModal = () => {
        if (isLoading) {
          return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Processing Attestation</h2>
                <div className="flex items-center">
                  <p>Please wait while your attestation is being processed...</p>
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              </div>
            </div>
          );
        } else if (attestationUID) {
          return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Attestation Created</h2>
                <p>Your attestation has been successfully created.</p>
                <p>Attestation UID: {attestationUID}</p>
                <Link href={`https://optimism.easscan.org/attestation/view/${attestationUID}`}>
                    View your attestation here!
                </Link>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => setAttestationUID('')}
                >
                  Close
                </button>
              </div>
            </div>
          );
        }
        return null;
      };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            onClick={onClose}>
            <div 
                className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center pt-8 p-2">
                    <h2 className="text-xl font-bold mb-4">{contribution.contribution}</h2>
                </div>
                <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
                <div className="mb-4 items-center py-3 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold text-center">Description</h3>
                    <p className='text-center'>{contribution.desc}</p>
                </div>
                <div className="mb-4 ">
                    <h3 className="font-semibold text-center">Link/Evidence</h3> 
                    <a href={contribution.link} className="text-gray-500 text-center hover:text-gray-300 visited:text-indigo-600 flex items-center">
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
            </div>
            {renderModal()}
        </div>
    );
};

export default AttestationModal;
