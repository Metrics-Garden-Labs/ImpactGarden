'use client';
import React, { useEffect, useState } from 'react';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../src/config/config';
import { AttestationNetworkType, Contribution, Project } from '../../src/types';
import { useEAS, useSigner } from '../../src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder, ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { RxCross2 } from 'react-icons/rx';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Link from 'next/link';
import AttestationCreationModal from '../components/attestationCreationModal';
import AttestationConfirmationModal from '../components/attestationConfirmationModal';
import { useSwitchChain } from 'wagmi';
import { getChainId, networkContractAddresses } from '../../src/utils/networkContractAddresses';
import pinataSDK from '@pinata/sdk';
import { FaInfoCircle } from 'react-icons/fa';
import { networks, checkNetwork } from '@/src/utils/projectSignUpUtils';
import { easScanEndpoints } from '@/src/utils/easScan';
import { Category, Subcategory, higherCategories, getSubcategories } from '@/src/utils/dbadding/addContributionModalUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: Contribution) => Promise<void>;
  addContributionCallback: (contribution: string) => void;
}

export default function AddContributionModal({ isOpen, onClose, addContributionCallback }: Props) {
  const [fid] = useGlobalState('fid');
  const [walletAddress] = useGlobalState('walletAddress');
  const [storedProject, setStoredProject] = useLocalStorage<Project>('selectedProject');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<AttestationNetworkType>('Optimism');
  const { switchChain } = useSwitchChain();
  const NO_EXPIRATION = 0n;
  const [user] = useLocalStorage('user', {
    fid: '',
    username: '',
    ethAddress: '',
  });

  const { eas, currentAddress, address, handleNetworkChange, selectedNetwork } = useEAS();
  const signer = useSigner();

  useEffect(() => {
    checkNetwork(selectedNetwork, switchChain);
  }, [selectedNetwork, switchChain]);

  useEffect(() => {
    const fetchProject = async () => {
      if (storedProject?.projectName) {
        try {
          const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectByName`, {
            method: 'POST',
            body: JSON.stringify({ projectName: storedProject.projectName }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch project data');
          }

          const { project } = await response.json();
          setSelectedProject(project);
        } catch (error) {
          console.error('Error fetching project data:', error);
        }
      }
    };

    fetchProject();
  }, [storedProject?.projectName]);

  
  useEffect(() => {
    if (selectedProject) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        projectName: selectedProject.projectName,
        category: selectedProject.category || '',
        ethAddress: currentAddress || '',
      }));
    }
  }, [selectedProject, currentAddress]);

  const [formData, setFormData] = useState<Contribution>({
    userFid: user.fid || '',
    projectName: storedProject?.projectName || '',
    governancetype: '',
    ecosystem: selectedNetwork,
    secondaryecosystem: '',
    contribution: '',
    category: storedProject?.category || '',
    subcategory: '',
    desc: '',
    link: '',
    easUid: '',
    ethAddress: currentAddress || '',
  });

  const handleNetworkChangeEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedValue = e.target.value as AttestationNetworkType;
    setEcosystem(selectedValue);
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

  const pinataUpload = async () => {
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY });

    try {
      const attestationMetadata = {
        name: selectedProject?.projectName,
        farcaster: user.fid,
        category: selectedProject?.category,
        subcategory: formData.subcategory,
        ecosystem: formData.ecosystem,
        secondaryEcosystem: formData.secondaryecosystem,
        contribution: formData.contribution,
        description: formData.desc,
        evidence: formData.link,
      };

      const res = await pin.pinJSONToIPFS(attestationMetadata);
      if (!res || !res.IpfsHash) {
        throw new Error('Invalid response from Pinata');
      }
      const pinataURL = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      console.log('Pinata URL:', pinataURL);
      return pinataURL;
    } catch (error) {
      console.error('Failed to upload to pinata:', error);
      alert('An error occurred while uploading to pinata. Please try again.');
      return '';
    }
  };

  const createAttestation1 = async () => {
    if (!user.fid) {
      alert('User not logged in');
      return '';
    }

    if (!eas || !currentAddress) {
      alert('Please connect wallet to continue');
      return '';
    }
    if (!signer) {
      console.error('Signer not available');
      return '';
    }

    if (
      formData.subcategory === '' ||
      formData.contribution === '' ||
      formData.desc === '' ||
      formData.link === ''
    ) {
      alert('Please fill in all required fields');
      return '';
    }

    try {
      setIsLoading(true);
      const pinataURL = await pinataUpload();
      if (!pinataURL) return '';

      const schema1 = '0xe035e3fe27a64c8d7291ae54c6e85676addcbc2d179224fe7fc1f7f05a8c6eac';

      const schemaEncoder2 = new SchemaEncoder(
        'bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL'
      );

      const encodedData1 = schemaEncoder2.encodeData([
        { name: 'projectRefUID', value: selectedProject?.projectUid || '', type: 'bytes32' },
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'name', value: selectedProject?.projectName || '', type: 'string' },
        { name: 'category', value: formData.governancetype || '', type: 'string' },
        { name: 'parentProjectRefUID', value: selectedProject?.primaryprojectuid || '', type: 'bytes32' },
        { name: 'metadataType', value: '0', type: 'uint8' },
        { name: 'metadataURL', value: pinataURL, type: 'string' },
      ]);
      console.log('Encoded Data:', encodedData1);

      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
      const delegatedSigner = await easop.getDelegated();
      const easnonce = await easop.getNonce(currentAddress);

      console.log('selectedProject', selectedProject);

      const attestationdata1: EIP712AttestationParams = {
        schema: schema1,
        recipient: selectedProject?.ethAddress || '',
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: selectedProject?.projectUid || ZERO_BYTES32,
        data: encodedData1,
        value: 0n,
        deadline: NO_EXPIRATION,
        nonce: easnonce,
      };

      console.log('Attestation Data:', attestationdata1);

      const signDelegated = await delegatedSigner.signDelegatedAttestation(attestationdata1, signer);
      console.log('Sign Delegated:', signDelegated);

      attestationdata1.data = encodedData1;
      const signature = signDelegated.signature;

      const dataToSend = {
        ...attestationdata1,
        signature: signature,
        attester: currentAddress,
      };

      const serialisedData = JSON.stringify(dataToSend, (key, value) =>
        typeof value === 'bigint' ? '0x' + value.toString(16) : value
      );
      console.log('Serialised Data:', serialisedData);

      const response = await fetch(`/api/delegateAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serialisedData,
      });
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (responseData.success) {
        console.log('Attestations created successfully');
        const attestationUID1 = responseData.attestationUID;
        setAttestationUID(attestationUID1);
        console.log('Attestation UID1:', attestationUID1);
        return attestationUID1;
      } else {
        throw new Error(`Failed to create attestations, Error: ${responseData.error}`);
      }
    } catch (error: any) {
      if (error.code === 4001) {
        console.error('User rejected the transaction', error);
        alert('Transaction was rejected by the user.');
      } else {
        console.error('Failed to create attestation:', error);
        alert('An error occurred while creating attestation. Please try again.');
      }
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const addContribution = async (contribution: Contribution): Promise<Contribution> => {
    try {
      const attestationUID = await createAttestation1();
      if (attestationUID) {
        const updatedContribution = { ...contribution, easUid: attestationUID };
        console.log('Updated Contribution:', updatedContribution);

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
      if (!address || address.trim() === '') {
        alert('Please connect your wallet to proceed.');
        return;
      }

      const newContribution = await addContribution(formData);
      if (newContribution) {
        addContributionCallback(newContribution.contribution);
        onClose();
      } else {
        console.error('Failed to add contribution');
      }
    } catch (error) {
      console.error('Failed to add contribution', error);
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setFormData({ ...formData, subcategory });
  };

  if (!isOpen) return null;

  const renderModal = () => {
    if (isLoading) {
      return <AttestationCreationModal />;
    } else if (attestationUID && selectedProject) {
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20" onClick={(e) => e.stopPropagation()}>
        <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">Add New Contribution</h2>
          </div>
          <div className="mb-4 items-center py-3 max-h-96 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-center mb-2">Type of Contribution</h3>
              <div className="flex flex-wrap justify-center">
                {getSubcategories(selectedProject?.category as Category).map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${formData.subcategory === subcategory ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          </div>

           {/* <div>
              <h2 className="font-semibold mt-4">Subcategories *</h2>
              <div className="flex flex-wrap mt-2">
                {Object.keys(renderSubcategories()).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryToggle(key as CategoryKey)}
                    className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${selectedCategories[key as CategoryKey] ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {selectedCategories[key as CategoryKey] ? '✓' : '+'} {renderSubcategories()[key as CategoryKey]}
                  </button>
                ))}
              </div>
            </div> */}
          <div className="mb-2">
            <h3 className="font-semibold p-2 text-center">Title <span className="tooltip tooltip-top" data-tip="Required"><FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} /></span></h3>
            <textarea
              value={formData.contribution}
              onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
              placeholder="Contribution Title"
              className="h-20 w-full p-2 border border-gray-800 rounded-md"
              required
              maxLength={100}
            />
            <div className="text-right mr-2">{formData.contribution.length}/100</div>
          </div>
          <div className="mb-2">
            <h3 className="font-semibold p-2 text-center">Description <span className="tooltip tooltip-top" data-tip="Required"><FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} /></span></h3>
            <textarea
              value={formData.desc ?? ''}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Description"
              className="h-20 w-full p-2 border border-gray-800 rounded-md"
              required
              maxLength={200}
            />
            <div className="text-right mr-2">{formData.desc.length}/200</div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold p-2 text-center">Link/Evidence <span className="tooltip tooltip-top" data-tip="Required"><FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} /></span></h3>
            <textarea
              value={formData.link ?? ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="Link/Evidence"
              className="h-20 w-full p-2 border border-gray-800 rounded-md"
              required
              data-tip="Please provide a link or evidence for your contribution"
            />
            {formData.link && (
              <div className="text-right mr-2">{formData.link.length}/200</div>
            )}
          </div>
          <div className="mb-4 text-center">
            <button className="btn items-center" type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Contribution'}
            </button>
          </div>
          <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
            <RxCross2 className="w-5 h-5" />
          </button>
        </form>
        {renderModal()}
      </div>
    </div>
  );
}
