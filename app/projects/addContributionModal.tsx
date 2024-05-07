// AddContributionModal.tsx
'use client';
import React, { useState } from 'react';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../src/config/config';
import { AttestationNetworkType, Contribution, Project } from '../../src/types';
import { useEAS } from '../../src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { RxCross2 } from 'react-icons/rx';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Link from 'next/link';
import { easScanEndpoints } from '../components/easScan';
import AttestationCreationModal from '../components/attestationCreationModal';



interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: Contribution) => Promise<void>;
}

export default function AddContributionModal({ isOpen, onClose,}: Props) {
  const [fid] = useGlobalState('fid');
  const [walletAddress] = useGlobalState('walletAddress');
  const [selectedProject] = useLocalStorage<Project | null>('selectedProject', null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ attestationUID, setAttestationUID ] = useState<string>("");
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });
  const [formData, setFormData] = useState<Contribution>({
    userFid: user.fid || '',
    projectName: selectedProject?.projectName || '',
    ecosystem: selectedProject?.ecosystem || '',
    contribution: '',
    desc: '',
    link: '',
    easUid: '',
    ethAddress: walletAddress,
  });



  const { eas, currentAddress } = useEAS();

  console.log('Project Ecosystem:', selectedProject?.ecosystem);
  console.log('Selected Project:', formData);

  const createAttestation = async (): Promise<string> => {

    if (!user.fid) {
      alert('User not logged in');
      return '';
    }

    if (!eas || !currentAddress) {
      console.error('EAS not initialized');
      return ''; 
    }

    try {
      setIsLoading(true);

      const contributionSchema = '0x132a4d5644fa6b85baf205fc25b069ba398bcecea7dc4b609c2ba20efb71da90';
      const schemaEncoder = new SchemaEncoder('uint24 userFid, string projectName, string contribution, string description, string link, string ecosystem');
      const encodedData = schemaEncoder.encodeData([
        { name: 'userFid', type: 'uint24', value: user.fid || 0},
        { name: 'projectName', type: 'string', value: selectedProject?.projectName || '' },
        { name: 'contribution', type: 'string', value: formData.contribution },
        { name: 'description', type: 'string', value: formData.desc || '' },
        { name: 'link', type: 'string', value: formData.link || '' },
        { name: 'ecosystem', type: 'string', value: selectedProject?.ecosystem || '' },
      ]);

      //console.log ("project name", project.projectName)
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
      const delegatedSigner = await easop.getDelegated();
      console.log('Delegated Signer:', delegatedSigner);

      const easnonce = await easop.getNonce(walletAddress);
      console.log('EAS Nonce:', easnonce);
      console.log("refUID", selectedProject?.projectUid )

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
        return ''; // Return an empty string if attestation UID is not available
      }
    } catch (error) {
      console.error('Error creating attestation:', error);
      return ''; // Return an empty string if an error occurs
    } finally {
      setIsLoading(false);
    }
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
        } else {
          console.log('Contribution added successfully', response);
          //refresh the page
          //add a 0.5s delay to allow the attestation to be processed
          setTimeout(() => {
          }, 500);
        }
        
      } else {
        console.error('Failed to create attestation');
      }
    } catch (error) {
      console.error('Failed to add contribution', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addContribution(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderModal = () => {
    if (isLoading) {
      return (
        AttestationCreationModal() 
      );
    } else if (attestationUID) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Attestation Created</h2>
            <p>Your attestation has been successfully created.</p>
            <Link href={`${easScanEndpoints[selectedProject?.ecosystem as AttestationNetworkType]}${attestationUID}`}>
              <p className='text-black hover:underline'>Attestation UID: {attestationUID}</p>
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
                className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-1/4 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
          <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">Add New Contribution</h2>
          </div>
          <div className="mb-4 items-center py-3 max-h-96 overflow-y-auto">
            <h3 className="font-semibold  p-2 text-center">Title</h3>
            <textarea
              value={formData.contribution}
              onChange={e => setFormData({ ...formData, contribution: e.target.value })}
              placeholder="Contribution Title"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
              required
            />
          </div>
          <div className="mb-4 ">
            <h3 className="font-semibold p-2 text-center">Description</h3>
            <textarea
              value={formData.desc}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Description"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
            />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold p-2 text-center">Link/Evidence</h3>
            <textarea
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="Link/Evidence"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
            />
          </div>
          <div className="mb-4 text-center">
            <button
              className="btn items-center"
              type="button"
              onClick={async () => {
                await addContribution(formData);
                onClose();
              }}
            >
              Add Contribution
            </button>
          </div>
          <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
                <RxCross2 className='w-5 h-5'/>
          </button>
          </form>
          {renderModal()}
        </div>
      
    </div>
  );
}