'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { NEXT_PUBLIC_URL, useGlobalState } from '@/src/config/config';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import AttestationCreationModal from '../components/ui/AttestationCreationModal';
import AttestationConfirmationModal from '../components/ui/AttestationConfirmationModal';
import { isAddress } from 'ethers';
import { EIP712AttestationParams, EAS, SchemaEncoder, ZERO_ADDRESS, NO_EXPIRATION, ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';
import { Contribution, ContributionAttestationWithUsername, Project, contributionRolesKey } from '@/src/types';
import GovernanceInfraToolingForm from '../components/attestations/governanceAttestationForms/GovernanceInfraToolingForm';
import GovernanceRAndAForm from '../components/attestations/governanceAttestationForms/GovernanceR&A';
import GovernanceCollabAndOnboarding from '../components/attestations/governanceAttestationForms/GovernanceCollabAndOnboarding';
import GovernanceStructuresFrom from '../components/attestations/governanceAttestationForms/GovernanceStructures';
import OnchainBuildersForm from '@/app/components/attestations/onchainBuildersAttstationForms/attesttationForm';
import { useSigner, useEAS } from '../../src/hooks/useEAS';
import pinataSDK from '@pinata/sdk';
import { easScanEndpoints } from '@/src/utils/easScan';
import AttestationModal from './AttestationModal';

interface AttestationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contribution: Contribution;
  project: Project;
  attestationCount: number;
}

const AttestationModal2: React.FC<AttestationModalProps> = ({
  isOpen,
  onClose,
  contribution,
  project,
  attestationCount,
}) => {
  const [isdelegate, setIsDelegate] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedback2, setFeedback2] = useState('');
  const [extrafeedback, setExtraFeedback] = useState('');
  const [walletAddress] = useGlobalState('walletAddress');
  const [fid] = useGlobalState('fid');
  const [selectedProject] = useGlobalState('selectedProject');
  const [isLoading, setIsLoading] = useState(false);
  const [attestationUID, setAttestationUID] = useState<string>("");
  const [recentAttestations, setRecentAttestations] = useState<ContributionAttestationWithUsername[]>([]);
  const [recentAttestationsLoading, setRecentAttestationsLoading] = useState(true);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [smileyRating, setSmileyRating] = useState(0);
  const signer = useSigner();
  const { eas, currentAddress, address, handleNetworkChange, selectedNetwork } = useEAS();
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });
  const [contributionRoles, setContributionRoles] = useState<{ [key in contributionRolesKey]: boolean }>({
    'OP Foundation Employee': false,
    'Metagovernance Designer': false,
    'Delegate': false,
    'Delegate (Token Holder)': false,
    'Badgeholder': false,
    'Other': false,
    'I do not actively participate in Optimism Governance': false,
  });

  const labels: { [key in contributionRolesKey]: string } = {
    'OP Foundation Employee': 'OP Foundation Employee',
    'Metagovernance Designer': 'Metagovernance Designer',
    'Delegate': 'Delegate',
    'Delegate (Token Holder)': 'Delegate (Token Holder)',
    'Badgeholder': 'Badgeholder',
    'Other': 'Other',
    'I do not actively participate in Optimism Governance': 'I do not actively participate in Optimism Governance',
  };

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      router.push(`${pathname}?contribution=${contribution.id}`);
      console.log('Contribution:', contribution);
      console.log('Contribution Category:', contribution.category);
      console.log('Contribution Subcategory:', contribution.subcategory);
    } else {
      router.push(pathname);
    }
  }, [isOpen, contribution.id, router, pathname]);

  const handleSmileyRating = (rate: number) => {
    setSmileyRating(rate);
    console.log("Smiley Rating set to: ", rate);
  }

  const handleRating1 = (rate: number) => {
    setRating1(rate);
    console.log("Rating for scale 1 set to: ", rate);
  };

  const handleRating2 = (rate: number) => {
    setRating2(rate);
    console.log("Rating for scale 2 set to: ", rate);
  };

  const handleRating3 = (rate: number) => {
    setRating3(rate);
    console.log("Rating for scale 3 set to: ", rate);
  };

  const handleClick = (key: contributionRolesKey) => {
    setContributionRoles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isValidEthereumAddress = (address: string): boolean => {
    return isAddress(project.ethAddress);
  };

  const pinataUpload = async (compiledData: any) => {
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY });

    try {
      console.log('Uploading to Pinata:', compiledData);
      const res = await pin.pinJSONToIPFS(compiledData);
      console.log('Pinata response:', res);
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

  const createAttestation = async (pinataURL: string): Promise<string> => {
    if (!user.fid) {
      alert('User not logged in');
      return '';
    }
  
    if (!eas || !currentAddress) {
      alert('Please connect your wallet to continue');
      return '';
    }
  
    if (!signer) {
      console.error('Signer not available');
      return '';
    }
  
    const recipientAddress = project.ethAddress && isValidEthereumAddress(project.ethAddress) ? project.ethAddress : ZERO_ADDRESS;
  
    try {
      console.log('Creating attestation with URL:', pinataURL);
      const schema = "0xc9bc703e3c48be23c1c09e2f58b2b6657e42d8794d2008e3738b4ab0e2a3a8b6";
      const schemaEncoder = new SchemaEncoder(
        'bytes32 contributionRegUID, bytes32 projectRegUID, uint256 farcasterID, string issuer, string metadataurl'
      );
      const encodedData = schemaEncoder.encodeData([
        { name: 'contributionRegUID', type: 'bytes32', value: contribution.primarycontributionuid || "" },
        { name: 'projectRegUID', type: 'bytes32', value: project.primaryprojectuid || "" },
        { name: 'farcasterID', type: 'uint256', value: user.fid },
        { name: 'issuer', type: 'string', value: "MGL" },
        { name: 'metadataurl', type: 'string', value: pinataURL },
      ]);
      console.log('Encoded data for attestation:', encodedData);
      const easop = new EAS('0x4200000000000000000000000000000000000021');
      easop.connect(signer);
      const delegatedSigner = await easop.getDelegated();
      const easnonce = await easop.getNonce(currentAddress);
  
      const attestationData: EIP712AttestationParams = {
        schema: schema,
        recipient: recipientAddress,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: contribution.primarycontributionuid || contribution.easUid || ZERO_BYTES32,
        data: encodedData,
        value: 0n,
        deadline: NO_EXPIRATION,
        nonce: easnonce,
      };
  
      const signDelegated = await delegatedSigner.signDelegatedAttestation(attestationData, signer);
      console.log('Signed attestation data:', signDelegated);
      attestationData.data = encodedData;
      const signature = signDelegated.signature;
  
      const dataToSend = {
        ...attestationData,
        signature: signature,
        attester: currentAddress,
      };
      console.log('Data to send:', dataToSend);
  
      const serialisedData = JSON.stringify(dataToSend, (key, value) =>
        typeof value === 'bigint' ? '0x' + value.toString(16) : value
      );
  
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serialisedData,
      });
      const responseData = await response.json();
      console.log('Delegate attestation response:', responseData);
  
      if (responseData.success) {
        setAttestationUID(responseData.attestationUID);
        return responseData.attestationUID;
      } else {
        throw new Error(`Failed to create attestations, Error: ${responseData.error}`);
      }
    } catch (error: any) {
      if (error.code === 4001) {
        alert('Transaction was rejected by the user.');
      } else {
        alert('An error occurred while creating attestation. Please try again.');
      }
      console.error('Error in createAttestation:', error);
      return "" ;
    } finally {
      setIsLoading(false);
    }
  };

  const extractOnchainBuildersData = (formData: any) => {
    return {
      likely_to_recommend: formData.likely_to_recommend,
      feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
    }
  }

  const extractCollabAndOnboardingData = (formData: any) => {
    return {
      governance_knowledge: formData.governance_knowledge,
      recommend_contribution: formData.recommend_contribution,
      feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
      explanation: formData.explanation,
      private_feedback: formData.private_feedback,
    };
  };

  const extractInfraToolingData = (formData: any) => {
    return {
      likely_to_recommend: formData.likely_to_recommend,
      feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
      explanation: formData.explanation,
      private_feedback: formData.private_feedback,
    };
  };

  const extractRAndDData = (formData: any) => {
    return {
      likely_to_recommend: formData.likely_to_recommend,
      useful_for_understanding: formData.useful_for_understanding,
      effective_for_improvements: formData.effective_for_improvements,
      explanation: formData.explanation,
      private_feedback: formData.private_feedback,
    };
  };

  const extractStructuresData = (formData: any) => {
    return {
      feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
      why: formData.why,
      explanation: formData.explanation,
      private_feedback: formData.private_feedback,
    };
  };

  const compileFormData = (commonData: any, specificData: any) => {
    return {
      ...commonData,
      data: specificData,
    };
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      console.log('Form Data:', formData);

      let specificData;
      switch (contribution.category) {
        case 'Onchain Builders':
          specificData = extractOnchainBuildersData(formData);
          break;
        case 'Governance':
          switch (contribution.subcategory) {
            case 'Collaboration & Onboarding':
              specificData = extractCollabAndOnboardingData(formData);
              break;
            case 'Infra & Tooling':
              specificData = extractInfraToolingData(formData);
              break;
            case 'Governance Research & Analytics':
              specificData = extractRAndDData(formData);
              break;
            case 'Governance Structures':
              specificData = extractStructuresData(formData);
              break;
            default:
              throw new Error('Unknown subcategory');
          }
          break;
        default:
          throw new Error('Unknown category');
      }

      const compiledData = compileFormData(contribution, specificData);
      console.log('Compiled Data:', compiledData);

      const pinataURL = await pinataUpload(compiledData);
      if (!pinataURL) throw new Error('Failed to upload data to IPFS');

      const attestationUID = await createAttestation(pinataURL);
      if (!attestationUID) throw new Error('Failed to create attestation');

      const attestationData = {
        userfid: user.fid,
        ethaddress: currentAddress,
        projectName: contribution.projectName,
        contribution: contribution.contribution,
        category: contribution.category,
        subcategory: contribution.subcategory,
        ecosystem: contribution.ecosystem,
        attestationUID: attestationUID,
        ...formData,
      };

      console.log('Attestation Data:', attestationData);

      const response = await fetch(`${NEXT_PUBLIC_URL}/api/addGovernanceAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attestationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit attestation');
      }

      const result = await response.json();
      console.log('Submission result:', result);

      // Close the modal after submission
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderForm = () => {
    // if (!contribution.category || !contribution.subcategory) {
    //   return (
    //     <div>No form available for the selected category or subcategory.</div>
    //   );
    // }
    
    switch (contribution.category) {
      case 'Governance':
        switch (contribution.subcategory) {
          case 'Infra & Tooling':
            return (
              <GovernanceInfraToolingForm
                handleRating1={handleRating1}
                handleRating2={handleRating2}
                handleRating3={handleRating3}
                handleSmileyRating={handleSmileyRating}
                smileyRating={smileyRating}
                rating1={rating1}
                rating2={rating2}
                rating3={rating3}
                contributionRoles={contributionRoles}
                handleClick={handleClick}
                labels={labels}
                feedback={feedback}
                setFeedback={setFeedback}
                extrafeedback={extrafeedback}
                setExtraFeedback={setExtraFeedback}
                onSubmit={handleFormSubmit}
                onClose={onClose}
              />
            );
          case 'Governance Research & Analytics':
            return (
              <GovernanceRAndAForm
                handleRating1={handleRating1}
                handleRating2={handleRating2}
                handleRating3={handleRating3}
                rating1={rating1}
                rating2={rating2}
                rating3={rating3}
                contributionRoles={contributionRoles}
                handleClick={handleClick}
                labels={labels}
                feedback={feedback}
                setFeedback={setFeedback}
                extrafeedback={extrafeedback}
                setExtraFeedback={setExtraFeedback}
                onSubmit={handleFormSubmit}
                onClose={onClose}
              />
            );
          case 'Collaboration & Onboarding':
            return (
              <GovernanceCollabAndOnboarding
                handleRating1={handleRating1}
                handleRating2={handleRating2}
                handleRating3={handleRating3}
                handleSmileyRating={handleSmileyRating}
                smileyRating={smileyRating}
                rating1={rating1}
                rating2={rating2}
                rating3={rating3}
                contributionRoles={contributionRoles}
                handleClick={handleClick}
                labels={labels}
                feedback={feedback}
                setFeedback={setFeedback}
                extrafeedback={extrafeedback}
                setExtraFeedback={setExtraFeedback}
                onSubmit={handleFormSubmit}
                onClose={onClose}
              />
            );
          case 'Governance Structures':
            return (
              <GovernanceStructuresFrom
                handleRating1={handleRating1}
                handleRating2={handleRating2}
                handleRating3={handleRating3}
                handleSmileyRating={handleSmileyRating}
                smileyRating={smileyRating}
                rating1={rating1}
                rating2={rating2}
                rating3={rating3}
                contributionRoles={contributionRoles}
                handleClick={handleClick}
                labels={labels}
                feedback={feedback}
                setFeedback={setFeedback}
                feedback2={feedback2}
                setFeedback2={setFeedback2}
                extrafeedback={extrafeedback}
                setExtraFeedback={setExtraFeedback}
                onSubmit={handleFormSubmit}
                onClose={onClose}
              />
            );
        }
        break;
      case 'Onchain Builders':
        return (
          <OnchainBuildersForm
            handleRating1={handleRating1}
            handleRating2={handleRating2}
            handleRating3={handleRating3}
            handleSmileyRating={handleSmileyRating}
            smileyRating={smileyRating}
            rating1={rating1}
            rating2={rating2}
            rating3={rating3}
            contributionRoles={contributionRoles}
            handleClick={handleClick}
            labels={labels}
            feedback={feedback}
            setFeedback={setFeedback}
            extrafeedback={extrafeedback}
            setExtraFeedback={setExtraFeedback}
            onSubmit={handleFormSubmit}
            onClose={onClose}
          />
        );
      case 'OP Stack':
        return (
          <div>No form available for OP Stack.</div>
        );
      default:
        return (
          <AttestationModal 
            contribution={contribution}
            project={project}
            attestationCount={attestationCount}
            onClose={onClose}
            isOpen={isOpen}
          />
        );
    }
    return null;
  };

  return (
    <div>
      {renderForm()}
      {isLoading && <AttestationCreationModal />}
      {attestationUID  && (
        <AttestationConfirmationModal
          attestationUID={attestationUID}
          attestationType={contribution}
          setAttestationUID={setAttestationUID}
          easScanEndpoints={easScanEndpoints}
        />
      )}
    </div>
  );
};

export default AttestationModal2;
