// AddContributionModal.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { NEXT_PUBLIC_URL, WHITELISTED_USERS, useGlobalState } from '../../src/config/config';
import { AttestationNetworkType, Contribution, Project } from '../../src/types';
import { useEAS } from '../../src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { RxCross2 } from 'react-icons/rx';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Link from 'next/link';
import { easScanEndpoints } from '../components/easScan';
import AttestationCreationModal from '../components/attestationCreationModal';
import { useSwitchChain } from 'wagmi';
import { getChainId } from '../components/networkContractAddresses';
import { FaInfoCircle } from 'react-icons/fa';
import AttestationConfirmationModal from '../components/attestationConfirmationModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: Contribution) => Promise<void>;
  addContributionCallback: (contribution: string) => void;
}

const networks: AttestationNetworkType[] = [
  'Ethereum', 'Optimism', 'Base', 'Arbitrum One', 'Polygon',
  'Scroll', 'Celo', 'Blast', 'Linea'
];

export default function AddContributionModal({ isOpen, onClose, addContributionCallback}: Props) {
  const [fid] = useGlobalState('fid');
  const [walletAddress] = useGlobalState('walletAddress');
  const [selectedProject] = useLocalStorage<Project>('selectedProject');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ attestationUID, setAttestationUID ] = useState<string>("");
  const [ ecosystem, setEcosystem ] = useState<AttestationNetworkType>('Optimism');
  const { switchChain } = useSwitchChain();
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });

  const { eas, currentAddress, address , handleNetworkChange, selectedNetwork} = useEAS();


  useEffect(() => {
    const checkNetwork = async () => {
      if (selectedNetwork) {
        const chainId = getChainId(selectedNetwork);
        if (chainId) {
          try {
            await switchChain({ chainId });
          } catch (error) {
            console.error('Failed to switch network:', error);
            // Show an error message or prompt to the user indicating the need to switch networks
            alert('Please switch to the correct network in your wallet.');
          }
        }
      }
    };
  
    checkNetwork();
  }, [selectedNetwork, switchChain]);

  const [formData, setFormData] = useState<Contribution>({
    userFid: user.fid || '',
    projectName: selectedProject?.projectName || '',
    governancetype: '',
    ecosystem: selectedNetwork,
    secondaryecosystem: '',
    contribution: '',
    desc: '',
    link: '',
    easUid: '',
    ethAddress: currentAddress || '',
  });

  const handleNetworkChangeEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedValue = e.target.value as AttestationNetworkType;
    setEcosystem(selectedValue);
    // Check if the selected network is 'mainnet' and adjust to 'Optimism', this will do for now
    if (selectedValue === 'Ethereum') {
      selectedValue = 'Optimism';
      alert('Mainnet is not supported at the moment, switching to Optimism.');
    }
    handleNetworkChange(selectedValue);
    console.log('Selected Network', selectedValue);
  
    const chainId = getChainId(selectedValue);
    if (chainId) {
      try {
        await switchChain({ chainId });
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };




  console.log('Project Ecosystem:', selectedProject?.ecosystem);
  console.log('Selected Project:', formData);

  const createAttestation = async (): Promise<string> => {

    if (!user.fid) {
      alert('User not logged in');
      return '';
    }

    if (!eas || !currentAddress) {
      alert('Please connect wallet to continue');
      return ''; 
    }
    if (
      formData.governancetype === '' ||
      formData.contribution === '' ||
      formData.desc === '' ||
      formData.link === ''
    ) {
      alert('Please fill in all required fields');
      return '';
    }

    // if (!WHITELISTED_USERS.includes(user.fid)) {
    //   alert('Access denied. Still in Alpha testing phase.');
    //   return ''; // Exit function if user is not whitelisted
    // }

    try {
      setIsLoading(true);

      const contributionSchema = '0xd13f3b9aa3f4e9ec3b70a76cd767fa64f4f7eb7a6a59e4b1e330d7dac6ec2ae9';
      const schemaEncoder = new SchemaEncoder('string Farcaster, string Project, string GovernanceType, string Ecosystem, string SecondaryEcosystem, string Contribution, string Description, string Evidence');
      const encodedData = schemaEncoder.encodeData([
        { name: 'Farcaster', type: 'string', value: user.fid },
        { name: 'Project', type: 'string', value: selectedProject?.projectName || '' },
        { name: 'GovernanceType', type: 'string', value: formData.governancetype || '' },
        { name: 'Ecosystem', type: 'string', value: formData.ecosystem },
        { name: 'SecondaryEcosystem', type: 'string', value: formData.secondaryecosystem || '' },
        { name: 'Contribution', type: 'string', value: formData.contribution },
        { name: 'Description', type: 'string', value: formData.desc || "" },
        { name: 'Evidence', type: 'string', value: formData.link || "" },  
      ]);

      console.log ("encodedData", encodedData)
      
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

  const addContribution = async (contribution: Contribution): Promise<Contribution> => {
    try {
      // Create the attestation
      const attestationUID = await createAttestation();
  
      if (attestationUID) {
        // Update the form data with the attestation UID
        const updatedContribution = { ...contribution, easUid: attestationUID };
        console.log('Updated Contribution:', updatedContribution);
  
        // Submit the form data to the API
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionDb`, {
          method: 'POST',
          body: JSON.stringify(updatedContribution),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to add contribution');
        }
  
        const addedContribution: Contribution = await response.json();
        //refresh to show the new contribution
        window.location.reload();

        return addedContribution;
      } else {
        throw new Error('Failed to create attestation');
      }
    } catch (error) {
      console.error('Failed to add contribution', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      // Check if the required fields are filled
  
      // Next, check if the wallet address is connected and is a non-empty string
      if (!address || address.trim() === "") {
        alert("Please connect your wallet to proceed.");
        return;  // Stop the function if there's no wallet address or if it's empty
      }
  
      const newContribution = await addContribution(formData);
      if (newContribution) {
        addContributionCallback(newContribution.contribution); // Pass the contribution property as a string
        onClose();
      } else {
        console.error('Failed to add contribution');
        // Optionally handle the error case in your UI, such as showing an error message
      }
    } catch (error) {
      console.error('Failed to add contribution', error);
      // Optionally handle the error case in your UI, such as showing an error message
    }
  };


  if (!isOpen) return null;

  const renderModal = () => {
    if (isLoading) {
      return (
        AttestationCreationModal() 
      );
    } else if (attestationUID) {
      return (
        <AttestationConfirmationModal
        attestationUID={attestationUID}
        attestationType={selectedProject}
        setAttestationUID={setAttestationUID}
        easScanEndpoints={easScanEndpoints}
    />
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
     onClick={onClose}>
      <div 
                className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
                onClick={(e) => e.stopPropagation()}
            >
          <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">Add New Contribution</h2>
          </div>
          <div className="mb-4 items-center py-3 max-h-96 overflow-y-auto">
            {/* dropdown for type of contribution */}
            <div>
            <h3 className="font-semibold text-center mb-2">Type of Governance Contribution</h3>
           
            
            <div className="mb-4">
              <select
                id="contributionType"
                name="contributionType"
                value={formData.governancetype || ''}
                onChange={e => setFormData({ ...formData, governancetype: e.target.value })}
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Contribution Type</option>
                <option value="Education">Education</option>
                <option value="Research">Research</option>
                <option value="Tooling">Tooling</option>
                <option value="Awareness">Awareness</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="attestationChain" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
              Main Ecosystem (Optimism only supported)
            </label>
            <div className=" mb-2">
              <select
                id="attestationChain"
                name="attestationChain"
                value={selectedNetwork}
                onChange={handleNetworkChangeEvent}
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {networks.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>
          </div>
            <h3 className='font-semibold p-2 text-center'>Secondary Ecosystems</h3>
            <textarea
              value={formData.secondaryecosystem || ''}
              onChange={e => setFormData({ ...formData, secondaryecosystem: e.target.value })}
              placeholder="Ecosystems"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
              />
          </div>
          <div className="mb-2">
            <h3 className="font-semibold  p-2 text-center">Title 
            <span className="tooltip tooltip-top" data-tip="Required">
              <FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} />
            </span>
            </h3>
            <textarea
              value={formData.contribution}
              onChange={e => setFormData({ ...formData, contribution: e.target.value })}
              placeholder="Contribution Title"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
              required
              maxLength={100}
              />
              <div className="text-right mr-2">
                {formData.contribution.length}/100
              </div>
          </div>
          <div className="mb-2 ">
            <h3 className="font-semibold p-2 text-center">Description 
            <span className="tooltip tooltip-top" data-tip="Required">
              <FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} />
            </span>
            </h3>
            <textarea
              value={formData.desc ?? ''}
              onChange={e => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Description"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
              required
              maxLength={200}
          />
          <div className="text-right mr-2">
            {formData.desc.length}/200
          </div>
          
          </div>
          <div className="mb-4">
            <h3 className="font-semibold p-2 text-center">Link/Evidence 
            <span className="tooltip tooltip-top" data-tip="Required">
              <FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} />
            </span>
            </h3>
            <textarea
              value={formData.link ?? ''}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
              placeholder="Link/Evidence"
              className='h-20 w-full p-2 border border-gray-800 rounded-md'
              required
              data-tip="Please provide a link or evidence for your contribution"
              />
              <div className="text-right mr-2">
                {formData.link.length}/200
              </div>
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