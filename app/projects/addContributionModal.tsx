'use client';
import React, { useEffect, useState } from 'react';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../src/config/config';
import { AttestationNetworkType, CategoryKey, Contribution, ContributionWithAttestationCount, Project, higherCategoryKey } from '../../src/types';
import { useEAS, useSigner } from '../../src/hooks/useEAS';
import { AttestationRequestData, EAS, EIP712AttestationParams, SchemaEncoder, ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
import { RxCross2 } from 'react-icons/rx';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import AttestationCreationModal from '../components/ui/AttestationCreationModal';
import AttestationConfirmationModal from '../components/ui/AttestationConfirmationModal';
import { useSwitchChain } from 'wagmi';
import { getChainId, networkContractAddresses } from '../../src/utils/networkContractAddresses';
import pinataSDK from '@pinata/sdk';
import { FaInfoCircle } from 'react-icons/fa';
import { networks, checkNetwork } from '@/src/utils/projectSignUpUtils';
import { easScanEndpoints } from '@/src/utils/easScan';
import { Category, Subcategory, higherCategories, getSubcategories } from '@/src/utils/addContributionModalUtils';
import AddContributionForm from '../components/contributions/AddContributionForm';
import { useNormalAttestation } from '@/src/hooks/useNormalAttestation';
import { useDelegatedAttestation } from '@/src/hooks/useDelegatedAttestation';
import { usePinataUpload } from '@/src/hooks/usePinataUpload';
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

  const [error, setError] = useState<string | null>(null);

  const { eas, currentAddress, address, handleNetworkChange, selectedNetwork } = useEAS();
  const signer = useSigner();

  const { uploadToPinata, isUploading } = usePinataUpload();
  const { createNormalAttestation, isCreating: isCreatingNormal } = useNormalAttestation();
  const { createDelegatedAttestation, isCreating: isCreatingDelegated } = useDelegatedAttestation();

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

  console.log('formData:', formData);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!address) {
      alert('Please connect your wallet to proceed.');
      return;
    }

    setIsLoading(true);

    try {
      const pinataURL1 = await uploadToPinata({
        name: selectedProject?.projectName,
        farcaster: fid,
        category: formData.category,
        subcategory: formData.subcategory,
        ecosystem: formData.ecosystem,
        secondaryEcosystem: formData.secondaryecosystem,
        contribution: formData.contribution,
        description: formData.desc,
        evidence: formData.link,
      });

      console.log('Pinata URL 1:', pinataURL1);

      const schemaEncoder = new SchemaEncoder(
        'bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL'
      );

      const encodedData1 = schemaEncoder.encodeData([
        { name: 'projectRefUID', value: selectedProject?.projectUid || '', type: 'bytes32' },
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'name', value: formData.contribution || '', type: 'string' },
        { name: 'category', value: formData.category || '', type: 'string' },
        { name: 'parentProjectRefUID', value: selectedProject?.primaryprojectuid || '', type: 'bytes32' },
        { name: 'metadataType', value: '0', type: 'uint8' },
        { name: 'metadataURL', value: pinataURL1, type: 'string' },
      ]);

      const attestationUID1 = await createNormalAttestation(
        '0xe035e3fe27a64c8d7291ae54c6e85676addcbc2d179224fe7fc1f7f05a8c6eac',
        encodedData1,
        selectedProject?.ethAddress || '',
        selectedProject?.primaryprojectuid || ''
      );

      const pinataURL2 = await uploadToPinata({
        contribution: formData.contribution,
        description: formData.desc,
        evidence: formData.link,
      });

      const schemaEncoder2 = new SchemaEncoder(
        'bytes32 contributionRegUID, string subcategory, string metadataurl'
      );
      const encodedData2 = schemaEncoder2.encodeData([
        { name: 'contributionRegUID', value: attestationUID1, type: 'bytes32' },
        { name: 'subcategory', value: formData.subcategory || '', type: 'string' },
        { name: 'metadataurl', value: pinataURL2, type: 'string' },
      ]);

      const attestationUID2 = await createDelegatedAttestation(
        '0x4921fe519ace82fb51a7318b9f79904c77800ca1db4ce8cc4d7c18293ae92f5a',
        encodedData2,
        selectedProject?.ethAddress || '',
        selectedProject?.primaryprojectuid || ''
      );

      const updatedContribution = {
        ...formData,
        primarycontributionuid: attestationUID1,
        easUid: attestationUID2,
      };

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionDb`, {
        method: 'POST',
        body: JSON.stringify(updatedContribution),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to add contribution');

      const addedContribution: Contribution = await response.json();
      console.log('Added Contribution:', addedContribution);
      addContributionCallback(addedContribution.contribution);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to add contribution', error);
      alert('An error occurred while adding the contribution. Please try again.');
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
    <AddContributionForm
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      handleHigherCategoryChange={handleHigherCategoryChange}
      handleSubcategorySelect={handleSubcategorySelect}
      selectedHigherCategory={selectedHigherCategory}
      isLoading={isLoading}
      onClose={onClose}
      renderModal={renderModal}
    />
  );
  
            }