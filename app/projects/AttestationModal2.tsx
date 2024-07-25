import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalState } from '@/src/config/config'; 
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
      console.log('Contribution Category:', contribution.category)
      console.log('Contribution Subcategory:', contribution.subcategory);
    } else {
      router.push(pathname);
    }
  }, [isOpen, contribution.id, router, pathname]);

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

//   const createAttestation = async () => {
//     console.log('user.fid:', user.fid);
//     if (!user.fid) {
//       alert('User not logged in');
//       return;
//     }

//     if (!walletAddress) {
//       alert('Please connect your wallet to continue');
//       return;
//     }

//     // Add your EAS and signature logic here...

//     const newAttestation = {
//       userFid: user.fid,
//       projectName: contribution.projectName,
//       contribution: contribution.contribution,
//       ecosystem: contribution.ecosystem,
//       attestationUID: attestationUID,
//       attesterAddy: walletAddress,
//       rating: `${rating1}, ${rating2}, ${rating3}`, // Store all ratings
//       feedback: feedback,
//       extrafeedback: extrafeedback,
//       isdelegate: isdelegate ? true : false,
//     };

//     console.log('New Attestation:', newAttestation);

//     // Post to your backend...
//   };

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
                onClose={onClose}
                // createAttestation={createAttestation}
              />
            );
            case 'Governance Research & Analytics':
                return(
                    <GovernanceRAndAForm
                        handleRating1={handleRating1}
                        handleRating2={handleRating2}
                        rating1={rating1}
                        rating2={rating2}
                        contributionRoles={contributionRoles}
                        handleClick={handleClick}
                        labels={labels}
                        feedback={feedback}
                        setFeedback={setFeedback}
                        extrafeedback={extrafeedback}
                        setExtraFeedback={setExtraFeedback}
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
      {attestationUID && (
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
