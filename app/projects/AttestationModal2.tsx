'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import AttestationCreationModal from '../components/ui/AttestationCreationModal';
import AttestationConfirmationModal from '../components/ui/AttestationConfirmationModal';
import { Contribution, Project } from '@/src/types';
import GovernanceInfraToolingForm from '../components/attestations/governanceAttestationForms/GovernanceInfraToolingForm';
import GovernanceRAndAForm from '../components/attestations/governanceAttestationForms/GovernanceR&A';
import GovernanceCollabAndOnboarding from '../components/attestations/governanceAttestationForms/GovernanceCollabAndOnboarding';
import GovernanceStructuresFrom from '../components/attestations/governanceAttestationForms/GovernanceStructures';
import OnchainBuildersForm from '@/app/components/attestations/onchainBuildersAttstationForms/attesttationForm';
import { useSigner, useEAS } from '../../src/hooks/useEAS';
import { easScanEndpoints } from '@/src/utils/easScan';
import AttestationModal from './AttestationModal';
import { useContributionAttestation } from '@/src/hooks/useNormalAttestation';

interface AttestationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contribution: Contribution;
  project: Project;
}

const AttestationModal2: React.FC<AttestationModalProps> = ({
  isOpen,
  onClose,
  contribution,
  project,
}) => {
  const [feedback, setFeedback] = useState('');
  const [feedback2, setFeedback2] = useState('');
  const [extrafeedback, setExtraFeedback] = useState('');
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [smileyRating, setSmileyRating] = useState(0);
  const signer = useSigner();
  const { eas, currentAddress} = useEAS();
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });

  const [attestationUID, setAttestationUID] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const {
    isLoading,
    pinataUpload,
    createAttestation
  } = useContributionAttestation();

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

  const compileFormData = (commonData: any, specificData: any) => {
    return {
      ...commonData,
      data: specificData,
    };
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      console.log('Form Data:', formData);

      let specificData;
      switch (contribution.category) {
        case 'Onchain Builders':
          specificData = {
            likely_to_recommend: formData.likely_to_recommend,
            feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
          }
          break;
        case 'Governance':
          switch (contribution.subcategory) {
            case 'Collaboration & Onboarding':
              specificData = {
                governance_knowledge: formData.governance_knowledge,
                recommend_contribution: formData.recommend_contribution,
                feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
                explanation: formData.explanation,
                private_feedback: formData.private_feedback,
              }
              break;
            case 'Infra & Tooling':
              specificData = {
                likely_to_recommend: formData.likely_to_recommend,
                feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
                explanation: formData.explanation,
                private_feedback: formData.private_feedback,
              }
              break;
            case 'Governance Research & Analytics':
              specificData = {
                likely_to_recommend: formData.likely_to_recommend,
                useful_for_understanding: formData.useful_for_understanding,
                effective_for_improvements: formData.effective_for_improvements,
                explanation: formData.explanation,
                private_feedback: formData.private_feedback,
              }
              break;
            case 'Governance Structures':
              specificData = {
                feeling_if_didnt_exist: formData.feeling_if_didnt_exist,
                why: formData.why,
                explanation: formData.explanation,
                private_feedback: formData.private_feedback,
              }
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

      const attestationUID = await createAttestation(pinataURL, contribution, project, user);
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
  };
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
                smileyRating={smileyRating}
                rating1={rating1}
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
                rating1={rating1}
                rating2={rating2}
                rating3={rating3}
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
              smileyRating={smileyRating}
              rating1={rating1}
              feedback={feedback}
              extrafeedback={extrafeedback}
              setFeedback={setFeedback}
              setExtraFeedback={setExtraFeedback}
              onSubmit={handleFormSubmit}
              onClose={onClose}
              />
            );
          case 'Governance Structures':
            return (
              <GovernanceStructuresFrom
                smileyRating={smileyRating}
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
            smileyRating={smileyRating}
            rating1={rating1}
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
      {attestationUID  &&  (
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
