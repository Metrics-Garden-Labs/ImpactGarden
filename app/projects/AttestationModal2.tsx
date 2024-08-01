import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { NEXT_PUBLIC_URL, useGlobalState } from '@/src/config/config';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import AttestationCreationModal from '../components/attestationCreationModal';
import AttestationConfirmationModal from '../components/attestationConfirmationModal';
import { isAddress } from 'ethers';
import { EIP712AttestationParams, EAS, SchemaEncoder, ZERO_ADDRESS, NO_EXPIRATION } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { Contribution, ContributionAttestationWithUsername, Project, contributionRolesKey } from '@/src/types';
import GovernanceInfraToolingForm from '@/src/utils/contributionAttestations/GovernanceInfraToolingForm';
import GovernanceRAndAForm from '@/src/utils/contributionAttestations/GovernanceR&A';
import { easScanEndpoints } from '@/src/utils/easScan';
import GovernanceCollabAndOnboarding from '@/src/utils/contributionAttestations/GovernanceCollabAndOnboarding';
import { ZeroAddress } from 'ethers';

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

  const handleFormSubmit = async (formData: any) => {
    try {
      console.log('Form Data:', formData);
      const attestationUID = ZeroAddress;
      const attestationData = { 
        userfid: user.fid,
        ethaddress: user.ethAddress,
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
    }
  };
  

  if (!isOpen) return null;

  const renderForm = () => {
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
          // Add more cases here for other subcategories under Governance...
        }
        break;
      // Add more cases here for other categories...
    }
    return null;
  };

  return (
    <div>
      {renderForm()}
      {isLoading && <AttestationCreationModal />}
      {attestationUID && selectedProject &&(
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