import React, { useEffect, useState } from 'react';
import { AttestationDisplay, AttestationNetworkType, Contribution } from '@/src/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { easScanEndpoints } from '../../../src/utils/easScan';

interface AttestationCardProps {
  contribution: Contribution;
  fetchRecentAttestations: () => Promise<void>;
  recentAttestations: AttestationDisplay[];
  recentAttestationsLoading: boolean;
  handleAttestationClick: (attestation: AttestationDisplay) => void;
}

const AttestationCard: React.FC<AttestationCardProps> = ({
  contribution,
  fetchRecentAttestations,
  recentAttestations,
  recentAttestationsLoading,
  handleAttestationClick,
}) => {

  useEffect(() => {
    fetchRecentAttestations();
  }, []);

  const renderAttestationContent = (attestation: AttestationDisplay) => {
    const { subcategory, category } = contribution;

    if (!subcategory || subcategory === "" || category === "" || !category ) {
      if('feedback' in attestation) {
      return (
        <>
          <p className='text-sm text-gray-500 mb-2'>Feedback: {attestation.feedback}</p>
          <p className='text-sm text-gray-500 mb-2'>Rating: {attestation.rating}</p>
        </>
      );
    }
    }
    switch (contribution.category)  {
      case "Onchain Builders":
        if ('likely_to_recommend' in attestation) {
          return (
            <>
              <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.likely_to_recommend}</p>
              {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
            </>
          );
        }
        break;
      case "OP Stack":
        if('feeling_if_didnt_exist' in attestation) {
          return (
            <>
              <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
              {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
            </>
          );
        }
      case "Governance":
        switch (contribution.subcategory) {
          case 'Infra & Tooling':
            if ('likely_to_recommend' in attestation) {
              return (
                <>
                  <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.likely_to_recommend}</p>
                  <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
                  {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
                </>
              );
            }
            break;
          case 'Governance Research & Analytics':
            if ('useful_for_understanding' in attestation) {
              return (
                <>
                  <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.likely_to_recommend}</p>
                  <p className='text-sm text-gray-500 mb-2'>Useful for Understanding: {attestation.useful_for_understanding}</p>
                  <p className='text-sm text-gray-500 mb-2'>Effective for Improvements: {attestation.effective_for_improvements}</p>
                  {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
                </>
              );
            }
            break;
          case 'Collaboration & Onboarding':
            if ('governance_knowledge' in attestation) {
              return (
                <>
                  <p className='text-sm text-gray-500 mb-2'>Governance Knowledge: {attestation.governance_knowledge}</p>
                  <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.recommend_contribution}</p>
                  <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
                  {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
                </>
              );
            }
            break;
            case 'Governance Structures':
              if ('examples_of_usefulness' in attestation) {
              return(
                <>
                  <p className='text-md text-black mb-2'>{attestation.contribution}</p>
                  <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
                  <p className='text-sm text-gray-500 mb-2'>Examples of Usefulness: {attestation.examples_of_usefulness}</p>
                  {/* <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p> */}
                </>
              );
            }
    }
      default:
        return null;
    }
  };

  return (
    <div className="text-black text-left">
      <h3 className="font-semibold mb-4">Attestations</h3>
      {recentAttestationsLoading ? (
        <p>Loading...</p>
      ) : recentAttestations.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto'>
          {recentAttestations.map((attestation, index) => {
            const attestationLink = `${easScanEndpoints[contribution.ecosystem as AttestationNetworkType]}${attestation.attestationUID}`;
            return (
              <div key={index} 
                className='p-4 bg-white border rounded-lg shadow-md'
                onClick={() => handleAttestationClick(attestation)}
                >
                <div className='flex items-start mb-2'>
                  {attestation.pfp && (
                    <Image
                      src={attestation.pfp}
                      alt={attestation.username}
                      width={40}
                      height={40}
                      className='mr-2 rounded-full'
                    />
                  )}
                  <div>
                    <h3 className='text-lg font-semibold'>{attestation.username}</h3>
                    {renderAttestationContent(attestation)}
                    <p className='text-sm text-gray-500'>
                      {format(new Date(attestation.createdAt || ''), 'MMMM dd, yyyy')}
                    </p>
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

export default AttestationCard;
