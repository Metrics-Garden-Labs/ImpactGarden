import React from 'react';
import { AttestationDisplay, AttestationNetworkType, GovCollabAndOnboardingDisplay, GovInfraAndToolingDisplay, GovRandADisplay, GovStructuresDisplay, OPStackDisplay, OnchainBuildersDisplay, Project } from '@/src/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { easScanEndpoints } from '@/src/utils/easScan';

interface ContributionAttestationsProps {
  recentAttestations: AttestationDisplay[];
  recentAttestationsLoading: boolean;
  handleAttestationClick: (attestation: AttestationDisplay) => void;
  project: Project;
}

function isGovRandADisplay(attestation: AttestationDisplay): attestation is GovRandADisplay {
  return (attestation as GovRandADisplay).useful_for_understanding !== undefined;
}

function isGovCollabAndOnboardingDisplay(attestation: AttestationDisplay): attestation is GovCollabAndOnboardingDisplay {
  return (attestation as GovCollabAndOnboardingDisplay).governance_knowledge !== undefined;
}

function isGovInfraAndToolingDisplay(attestation: AttestationDisplay): attestation is GovInfraAndToolingDisplay {
  return (attestation as GovInfraAndToolingDisplay).likely_to_recommend !== undefined;
}

function isGovStructuresOpDisplay(attestation: AttestationDisplay): attestation is GovStructuresDisplay {
  return (attestation as GovStructuresDisplay).examples_of_usefulness !== undefined;
}

function isOnchainBuildersDisplay(attestation : AttestationDisplay): attestation is OnchainBuildersDisplay {
  return (attestation as OnchainBuildersDisplay).explanation == undefined;
}

function isOPStackDisplay(attestation: AttestationDisplay): attestation is OPStackDisplay {
  return (attestation as OPStackDisplay).feeling_if_didnt_exist !== undefined;
}

const ContributionAttestations: React.FC<ContributionAttestationsProps> = ({
  recentAttestations,
  recentAttestationsLoading,
  handleAttestationClick,
  project,
}) => {

  const renderAttestationContent = (attestation: AttestationDisplay) => {
    if (isGovRandADisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Governance Research and Analytics</p> */}
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.likely_to_recommend}</p>
          <p className='text-sm text-gray-500 mb-2'>Effective for Improvements: {attestation.effective_for_improvements}</p>
          <p className='text-sm text-gray-500 mb-2'>Useful for Understanding: {attestation.useful_for_understanding}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isGovCollabAndOnboardingDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Collaboration and Onboarding</p> */}
          <p className='text-sm text-gray-500 mb-2'>Governance Knowledge: {attestation.governance_knowledge}</p>
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.recommend_contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isGovInfraAndToolingDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Infrastructure and Tooling</p> */}
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.likely_to_recommend}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if (isGovStructuresOpDisplay(attestation)) {
      return(
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
          <p className='text-sm text-gray-500 mb-2'>Examples of Usefulness: {attestation.examples_of_usefulness}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    if(isOnchainBuildersDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.recommend_contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
        </>
      );
    }

    if(isOPStackDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
          {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
        </>
      );
    }

    // Default case for generic attestations
    if ('feedback' in attestation) {
      return (
        <>
          {/* <p className='text-sm text-gray-500 mb-2'>Feedback: {attestation.feedback}</p> */}
          <p className='text-sm text-gray-500 mb-2'>Rating: {attestation.rating}</p>
        </>
      );
    }

    return null;
  };

  return (
    <div className="text-black text-left">
      <h3 className="font-semibold mb-4">Insights</h3>
      {recentAttestationsLoading ? (
        <p>Loading...</p>
      ) : recentAttestations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
          {recentAttestations.map((attestation, index) => {
            return (
              <div
                key={index}
                className="p-4 bg-white border rounded-lg shadow-md"
                onClick={() => handleAttestationClick(attestation)}
              >
                <div className="flex items-start mb-2">
                  {attestation.pfp && (
                    <Image
                      src={attestation.pfp}
                      alt={attestation.username}
                      width={40}
                      height={40}
                      className="mr-2 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {attestation.username}
                    </h3>
                    {renderAttestationContent(attestation)}
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(attestation.createdAt || ''),
                        'MMMM dd, yyyy'
                      )}
                    </p>
                    {/* <Link href={attestationLink}>
                              <p className='text-black hover:underline'>View Attestation</p>
                        </Link> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No attestations yet.</p>
      )}
    </div>
  );
};

export default ContributionAttestations;
