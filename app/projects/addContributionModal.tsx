'use client';
import React, { useEffect, useState } from 'react';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../src/config/config';
import { AttestationNetworkType, CategoryKey, Contribution, ContributionWithAttestationCount, Project, higherCategoryKey } from '../../src/types';
import { useEAS, useSigner } from '../../src/hooks/useEAS';
import { AttestationRequestData, EAS, EIP712AttestationParams, SchemaEncoder, ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
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
import { create } from 'domain';
import { set } from 'zod';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContribution: (contribution: ContributionWithAttestationCount) => Promise<void>;
  addContributionCallback: (contribution: string) => void;
}

export default function AddContributionModal({ isOpen, onClose, addContributionCallback }: Props) {
  const [fid] = useGlobalState('fid');
  const [walletAddress] = useGlobalState('walletAddress');
  const [storedProject, setStoredProject] = useLocalStorage<Project>('selectedProject');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [attestationUID2, setAttestationUID2] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<AttestationNetworkType>('Optimism');
  const { switchChain } = useSwitchChain();
  const [selectedHigherCategory, setSelectedHigherCategory] = useState<higherCategoryKey | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<{ [key in CategoryKey]?: boolean }>({});
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
        // category: selectedProject.category || '',
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
    category: '',
    subcategory: '',
    desc: '',
    link: '',
    primarycontributionuid: '',
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

  const pinataUpload1 = async () => {
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY });

    try {
      const attestationMetadata = {
        name: selectedProject?.projectName,
        farcaster: user.fid,
        category: formData.category,
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
      const pinataURL1 = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      console.log('Pinata URL:', pinataURL1);
      return pinataURL1;
    } catch (error) {
      console.error('Failed to upload to pinata:', error);
      alert('An error occurred while uploading to pinata. Please try again.');
      return '';
    }
  };

  const createAttestation1 = async (): Promise<string> => {
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
      formData.category === '' ||
      formData.subcategory === '' ||
      formData.contribution === '' ||
      formData.desc === '' ||
      formData.link === ''
    ) {
      alert('Please fill in all required fields');
      return '';
    }
  
    try {
      const pinataURL1 = await pinataUpload1();
      if (!pinataURL1) return '';
  
      const schema1 = '0xe035e3fe27a64c8d7291ae54c6e85676addcbc2d179224fe7fc1f7f05a8c6eac';
  
      const schemaEncoder2 = new SchemaEncoder(
        'bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL'
      );
  
      const encodedData1 = schemaEncoder2.encodeData([
        { name: 'projectRefUID', value: selectedProject?.projectUid || '', type: 'bytes32' },
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'name', value: formData.contribution || '', type: 'string' },
        { name: 'category', value: formData.category || '', type: 'string' },
        { name: 'parentProjectRefUID', value: selectedProject?.primaryprojectuid || '', type: 'bytes32' },
        { name: 'metadataType', value: '0', type: 'uint8' },
        { name: 'metadataURL', value: pinataURL1, type: 'string' },
      ]);
      console.log('Encoded Data:', encodedData1);
  
      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
  
      const attestationdata1: AttestationRequestData = {
        recipient: selectedProject?.ethAddress || '',
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: selectedProject?.primaryprojectuid || ZERO_BYTES32,
        data: encodedData1,
        value: 0n,
      };
  
      console.log('Attestation Data:', attestationdata1);
  
      const dataToSend = {
        schema: schema1,
        ...attestationdata1,
      };
  
      const serialisedData = JSON.stringify(dataToSend, (key, value) =>
        typeof value === 'bigint' ? '0x' + value.toString(16) : value
      );
      console.log('Serialised Data:', serialisedData);
  
      const response = await fetch(`/api/projectAttestation`, {
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
    } catch (error) {
      console.error('Failed to create attestation 1:', error);
      alert('An error occurred while creating attestation 1. Please try again.');
      return '';
    }
  };
  

  const pinataUpload2 = async () => {
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY });

    try {
      const attestationMetadata = {
        // name: selectedProject?.projectName,
        // farcaster: user.fid,
        // category: formData.category,
        // subcategory: formData.subcategory,
        // ecosystem: formData.ecosystem,
        // secondaryEcosystem: formData.secondaryecosystem,
        contribution: formData.contribution,
        description: formData.desc,
        evidence: formData.link,
      };

      const res = await pin.pinJSONToIPFS(attestationMetadata);
      if (!res || !res.IpfsHash) {
        throw new Error('Invalid response from Pinata');
      }
      const pinataURL2 = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      console.log('Pinata URL:', pinataURL2);
      return pinataURL2;
    } catch (error) {
      console.error('Failed to upload to pinata:', error);
      alert('An error occurred while uploading to pinata. Please try again.');
      return '';
    }
  };

  

  const createAttestation2 = async (attestationUID1: string): Promise<string> => {
    if (!user.fid || user.fid === '') {
      alert('User not logged in, please login to continue');
      return '';
    }
    if (!eas || !currentAddress) {
      console.error('Wallet not connected. Please connect your wallet to continue');
      return '';
    }
    if (!signer) {
      console.error('Signer not available');
      return '';
    }
  
    const pinataURL2 = await pinataUpload2();
    console.log('Pinata URL2:', pinataURL2);
    if (!pinataURL2) {
      console.error('Failed to get Pinata URL');
      return '';
    }
  
    try {
      const schema2 = '0xd7da3655f6cd28c4d0d4191049f9f0f1254484a9dd4d624a51242fe2089f9bd5';
      const schemaEncoder2 = new SchemaEncoder(
        'bytes32 contributionRegistrationUID, string subcategory, string metadataUrl'
      );
      const encodedData2 = schemaEncoder2.encodeData([
        { name: 'contributionRegistrationUID', value: attestationUID1, type: 'bytes32' },
        { name: 'subcategory', value: formData.subcategory || '', type: 'string' },
        { name: 'metadataUrl', value: pinataURL2, type: 'string' },
      ]);
      console.log('Encoded Data2:', encodedData2);
      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
      const delegatedSigner = await easop.getDelegated();
      const easnonce = await easop.getNonce(currentAddress);
  
      console.log('selectedProject', selectedProject);
  
      const attestationdata2: EIP712AttestationParams = {
        schema: schema2,
        recipient: selectedProject?.ethAddress || '',
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: selectedProject?.primaryprojectuid || ZERO_BYTES32,
        data: encodedData2,
        value: 0n,
        deadline: NO_EXPIRATION,
        nonce: easnonce,
      };
  
      console.log('Attestation Data:', attestationdata2);
  
      const signDelegated = await delegatedSigner.signDelegatedAttestation(attestationdata2, signer);
      console.log('Sign Delegated:', signDelegated);
  
      attestationdata2.data = encodedData2;
      const signature = signDelegated.signature;
  
      const dataToSend = {
        ...attestationdata2,
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
        const attestationUID2 = responseData.attestationUID;
        setAttestationUID2(attestationUID2);
        console.log('Attestation UID2:', attestationUID2);
        return attestationUID2;
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
      setIsLoading(true);
      const attestationUID1 = await createAttestation1();
      if (!attestationUID1) throw new Error('Failed to create attestation 1');
  
      const attestationUID2 = await createAttestation2(attestationUID1);
      if (!attestationUID2) throw new Error('Failed to create attestation 2');
  
      const updatedContribution = { 
        ...contribution, 
        primarycontributionuid: attestationUID1, 
        easUid: attestationUID2 
      };
      console.log('Updated Contribution:', updatedContribution);
  
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionDb`, {
        method: 'POST',
        body: JSON.stringify(updatedContribution),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Failed to add contribution:', errorDetails);
        throw new Error('Failed to add contribution');
      }
  
      const addedContribution: Contribution = await response.json();
      console.log('Added Contribution:', addedContribution);
      window.location.reload();
      return addedContribution;
    } catch (error) {
      console.error('Failed to add contribution', error);
      throw error;
    } finally {
      setIsLoading(false);
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
  

  const handleHigherCategoryChange = (category: higherCategoryKey) => {
    setSelectedHigherCategory(category);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: category, // Update category in formData
      subcategory: '', // Reset subcategory when higher category changes
    }));
    setSelectedCategories({});
  };
  
  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subcategory: subcategory, // Update subcategory in formData
    }));
  };

  if (!isOpen) return null;

  const renderModal = () => {
    if (isLoading) {
      return <AttestationCreationModal />;
    } else if (attestationUID2 && selectedProject) {
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
      <div className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-2/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20" onClick={(e) => e.stopPropagation()}>
        <form className="bg-white p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">Add New Contribution</h2>
          </div>
          <div className="mb-4 items-center py-3 max-h-96 ">
            <div>
              <h3 className="font-semibold text-center mb-2">Type of Contribution</h3>
  
              <div>
                <h2 className="font-semibold mt-4">Category *</h2>
                <div className="flex flex-wrap mt-2">
                  {Object.keys(higherCategories).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleHigherCategoryChange(key as higherCategoryKey)}
                      className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${selectedHigherCategory === key ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                      {higherCategories[key as higherCategoryKey]}
                    </button>
                  ))}
                </div>
              </div> 
  
              <div className="relative mt-8">
                <h2 className="text-center">What is the subcategory?</h2>
                <div className="flex flex-wrap justify-center mt-4 h-48 overflow-y-auto p-2"> {/* Fixed height and scrollable area */}
                  {getSubcategories(selectedHigherCategory as Category).map((subcategory) => (
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
          </div>
  
          <div className="mb-2 mt-14">
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