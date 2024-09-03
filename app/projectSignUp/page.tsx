"use client";

import React, { FormEvent, useEffect, useState } from 'react';
import { WHITELISTED_USERS, useGlobalState, NEXT_PUBLIC_URL } from '../../src/config/config';
import { Project, AttestationNetworkType, AttestationData, higherCategoryKey, CategoryKey } from '@/src/types';
import { useSwitchChain } from 'wagmi';
import { useEAS, useSigner } from '../../src/hooks/useEAS';
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import { usePinataUpload } from '@/src/hooks/usePinataUpload';
import { useNormalAttestation } from '@/src/hooks/useNormalAttestation';
import { useDelegatedAttestation } from '@/src/hooks/useDelegatedAttestation';
import { getChainId, networkContractAddresses } from '../../src/utils/networkContractAddresses';
import { networks, checkNetwork } from '@/src/utils/projectSignUpUtils';
import AttestationCreationModal from '../components/ui/AttestationCreationModal';
import ConfirmationSection from '../components/projectSignUp/confirmationPage';
import Footer from '../components/ui/Footer';
import CenterColumn from '../components/projectSignUp/CenterColumn';
import LeftColumn from '../components/projectSignUp/LeftColumn';
import { ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
import { Metadata } from 'next';


export default function ProjectSignUp() {
  // State and hooks
  const [user, setUser] = useLocalStorage('user', { fid: '', username: '', ethAddress: '' });
  const [attestationData, setAttestationData] = useState<AttestationData>({
    projectName: '',
    oneliner: '',
    websiteUrl: '',
    twitterUrl: '',
    githubURL: '',
    category: "",
    farcaster: user.fid,
    mirror: '',
  });
  const [selectedProject, setSelectedProject] = useLocalStorage<Project | null>('selectedProject', null);
  const [captcha, setCaptcha] = useState<string | null>("");
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [attestationUID1, setAttestationUID1] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<string>('Optimism');
  const [secondaryEcosystem, setSecondaryEcosystem] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { switchChain } = useSwitchChain();
  const { eas, currentAddress, selectedNetwork, address, handleNetworkChange } = useEAS();
  const signer = useSigner();
  const { uploadToPinata, isUploading } = usePinataUpload();
  const { createNormalAttestation, isCreating: isCreatingNormal } = useNormalAttestation();
  const { createDelegatedAttestation, isCreating: isCreatingDelegated } = useDelegatedAttestation();

  // Effects
  useEffect(() => {
    checkNetwork(selectedNetwork, switchChain);
  }, [selectedNetwork, switchChain]);

  useEffect(() => {
    if (attestationUID1) {
      const project: Project = {
        userFid: user.fid,
        projectName: attestationData.projectName,
        oneliner: attestationData.oneliner,
        websiteUrl: attestationData.websiteUrl,
        twitterUrl: attestationData.twitterUrl,
        githubUrl: attestationData.githubURL,
        logoUrl: imageUrl,
        projectUid: attestationUID1,
        primaryprojectuid: attestationUID,
        ecosystem: ecosystem,
      };
      setSelectedProject(project);
    }
  }, [attestationUID1, attestationData, imageUrl, user.fid, ecosystem, setSelectedProject]);

  // Handlers
  const handleNetworkChangeEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedValue = e.target.value as AttestationNetworkType;
    setEcosystem(selectedValue);
    if (selectedValue === 'Ethereum') {
      selectedValue = 'Optimism';
      alert('Mainnet is not supported at the moment, switching to Optimism.');
    }
    handleNetworkChange(selectedValue);
    const chainId = getChainId(selectedValue);
    if (chainId) {
      try {
        await switchChain({ chainId });
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  const handleSecondaryEcosystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondaryEcosystem(e.target.value);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    if (!attestationData.projectName || !ecosystem || !attestationData.oneliner || !attestationData.websiteUrl) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsPreview(true);
  };

  const handleBackToEdit = () => setIsPreview(false);

  const createAttestation1 = async () => {
    if (!user.fid || !eas || !currentAddress || !signer) {
      setError('Please ensure you are logged in and your wallet is connected.');
      return;
    }

    try {
      const schema1 = '0x7ae9f4adabd9214049df72f58eceffc48c4a69e920882f5b06a6c69a3157e5bd';
      const schemaEncoder1 = new SchemaEncoder('uint256 farcasterID, string Issuer');
      const encodedData1 = schemaEncoder1.encodeData([
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'Issuer', value: 'MGL', type: 'string' },
      ]);

      const attestationUID = await createNormalAttestation(
        schema1,
        encodedData1,
        currentAddress,
        ZERO_BYTES32,
      );

      setAttestationUID(attestationUID);
      await createAttestation2(attestationUID);
    } catch (error) {
      console.error('Failed to create attestation 1:', error);
      setError('An error occurred while creating attestation 1. Please try again.');
    }
  };

  const createAttestation2 = async (attestationUID: string) => {
    if (!user.fid || !eas || !currentAddress || !signer) {
      setError('Please ensure you are logged in and your wallet is connected.');
      return;
    }

    try {
      const pinataURL = await uploadToPinata({
        ecosystem: ecosystem,
        secondaryEcosystem: secondaryEcosystem,
        description: attestationData.oneliner,
        link: attestationData.websiteUrl,
      });

      if (!pinataURL) {
        throw new Error('Failed to upload to Pinata');
      }

      const schema2 = "0x0de72a1e3d38bf069bce8e5b705dbf8421f921a830b046a6605d6050d1760dcd";
      const schemaEncoder2 = new SchemaEncoder('bytes32 projectRegUID, uint256 farcasterID, string projectname, string metadataurl');
      const encodedData2 = schemaEncoder2.encodeData([
        { name: 'projectRegUID', value: attestationUID, type: 'bytes32' },
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'projectname', value: attestationData.projectName, type: 'string' },
        { name: 'metadataurl', value: pinataURL, type: 'string' },
      ]);

      const attestationUID2 = await createDelegatedAttestation(
        schema2,
        encodedData2,
        currentAddress,
        attestationUID
      );

      setAttestationUID1(attestationUID2);

      // Add project to database
      const newProject = {
        userFid: user.fid,
        ethAddress: currentAddress,
        projectName: attestationData.projectName,
        websiteUrl: attestationData.websiteUrl,
        oneliner: attestationData.oneliner,
        twitterUrl: attestationData.twitterUrl,
        githubUrl: attestationData.githubURL,
        ecosystem: ecosystem,
        primaryprojectuid: attestationUID,
        projectUid: attestationUID2,
        logoUrl: imageUrl,
      };

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/addProjectDb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${response.status} - ${errorDetails.message || response.statusText}`);
      }

      const dbResponse = await response.json();
      console.log('Insert project to db success:', dbResponse);
    } catch (error) {
      console.error('Failed to create attestation 2:', error);
      setError('An error occurred while creating attestation 2. Please try again.');
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!captcha) {
      setError("Please complete the CAPTCHA to continue.");
      return;
    }

    if (!address || address.trim() === "") {
      setError("Please connect your wallet to proceed.");
      return;
    }

    try {
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/verifyCaptcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaResponse: captcha }),
      });

      if (response.ok) {
        setIsLoading(true);
        await createAttestation1();
      } else {
        setError('Captcha is invalid. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify captcha:', error);
      setError('An error occurred while verifying the captcha. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render functions
  const renderModal = () => isLoading ? <AttestationCreationModal /> : null;

  if (attestationUID1) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <ConfirmationSection
          attestationUID={attestationUID1}
          attestationData={attestationData}
          imageUrl={imageUrl}
          ecosystem={ecosystem}
          selectedProject={selectedProject}
          selectedNetwork={selectedNetwork}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">

      {!address && (
        <div
        role="alert"
        className="alert bg-[#E67529] text-white flex items-center rounded-none justify-center h-16 w-full "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Alert: Wallet not connected! Please connect your waller to continue.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row lg:flex-row justify-center items-start w-full mt-10 px-8 md:px-8">
      <LeftColumn 
          isPreview={isPreview}
          imageUrl={imageUrl}
          attestationData={attestationData}
        />
        <CenterColumn 
          isPreview={isPreview}
          attestationData={attestationData}
          handleInputChange={handleInputChange}
          handleNetworkChangeEvent={handleNetworkChangeEvent}
          handleSecondaryEcosystemChange={handleSecondaryEcosystemChange}
          selectedNetwork={selectedNetwork}
          secondaryEcosystem={secondaryEcosystem}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          handleNext={handleNext}
          handleBackToEdit={handleBackToEdit}
          onSubmit={onSubmit}
          setCaptcha={setCaptcha}
        />
        <div className="hidden lg:block lg:w-1/3">
        </div>
      </div>
      <Footer />
      {renderModal()}
    </div>
  );
}
