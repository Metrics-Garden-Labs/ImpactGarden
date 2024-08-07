import React, { useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { RxCross2 } from 'react-icons/rx';
import { Attestation2, AttestationDisplay, AttestationNetworkType } from '@/src/types';
import { easScanEndpoints } from '../../src/utils/easScan';

interface AttestationModalProps {
  attestation: Attestation2 | AttestationDisplay | null;
  isOpen: boolean;
  onClose: () => void;
}

const AttestationModalView: React.FC<AttestationModalProps> = ({ attestation, isOpen, onClose }) => {
  useEffect(() => {
    if (attestation) {
      console.log('Attestation in modal:', attestation);
    }
  }, [attestation]);

  if (!isOpen || !attestation) return null;

  const attestationLink = `${easScanEndpoints[attestation.ecosystem as AttestationNetworkType]}${attestation.attestationUID}`;

  const renderAttestationDetails = () => {
    console.log('Rendering attestation details:', attestation);

    if ('category' in attestation && attestation.category === "Governance") {
      if (attestation.subcategory === "Infra & Tooling") {
        return (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Likely to Recommend</h3>
              <p className="text-center">{attestation.likely_to_recommend || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Feeling if Contribution Didn’t Exist</h3>
              <p className="text-center">{attestation.feeling_if_didnt_exist || 'N/A'}</p>
            </div>
          </>
        );
      } else if (attestation.subcategory === "Governance Research & Analytics") {
        return (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Likely to Recommend</h3>
              <p className="text-center">{attestation.likely_to_recommend || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Useful for Understanding</h3>
              <p className="text-center">{attestation.useful_for_understanding || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Effective for Improvements</h3>
              <p className="text-center">{attestation.effective_for_improvements || 'N/A'}</p>
            </div>
          </>
        );
      } else if (attestation.subcategory === "Collaboration & Onboarding") {
        return (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Governance Knowledge</h3>
              <p className="text-center">{attestation.governance_knowledge || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Recommend Contribution</h3>
              <p className="text-center">{attestation.recommend_contribution || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Feeling if Contribution Didn’t Exist</h3>
              <p className="text-center">{attestation.feeling_if_didnt_exist || 'N/A'}</p>
            </div>
          </>
        );
      } else if (attestation.subcategory === "OP Governance Structure")
        return (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Feeling If Contribution Didn’</h3>
              <p className="text-center">{attestation.feeling_if_didnt_exist || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-center">Examples of Usefulness</h3>
              <p className="text-center">{attestation.examples_of_usefulness}</p>
            </div>
          </>
        );
    } else if ('useful_for_understanding' in attestation) {
      return (
        <>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Useful for Understanding</h3>
            <p className="text-center">{attestation.useful_for_understanding}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Effective for Improvements</h3>
            <p className="text-center">{attestation.effective_for_improvements}</p>
          </div>
          {/* <div className="mb-4">
            <h3 className="font-semibold text-center">Explanation</h3>
            <p className="text-center">{attestation.explanation}</p>
          </div> */}
        </>
      );
    } else if ('governance_knowledge' in attestation) {
      return (
        <>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Governance Knowledge</h3>
            <p className="text-center">{attestation.governance_knowledge}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Recommend Contribution</h3>
            <p className="text-center">{attestation.recommend_contribution}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Feeling if Contribution Didn’t Exist</h3>
            <p className="text-center">{attestation.feeling_if_didnt_exist}</p>
          </div>
          {/* <div className="mb-4">
            <h3 className="font-semibold text-center">Explanation</h3>
            <p className="text-center">{attestation.explanation}</p>
          </div> */}
        </>
      );
    } else if ('likely_to_recommend' in attestation) {
      return (
        <>
          <div className="mb-4">
            <h3 className="font-semibold text-center">Likely to Recommend</h3>
            <p className="text-center">{attestation.likely_to_recommend}</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          {attestation.rating && (
            <div className="mb-4">
              <h3 className="font-semibold text-center">Rating</h3>
              <p className="text-center">{attestation.rating}</p>
            </div>
          )}
          {('improvementareas' in attestation) && attestation.improvementareas && (
            <div className="mb-4">
              <h3 className="font-semibold text-center">Improvement Areas</h3>
              <p className="text-center">{attestation.improvementareas}</p>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
      <div
        className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center pt-8 p-2">
          <h2 className="text-xl font-bold mb-4">{('projectName' in attestation) ? attestation.projectName : 'Project'}</h2>
        </div>
        <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
        <div className="mb-4 items-center py-3">
          <h3 className="font-semibold text-center">Contribution</h3>
          <p className="text-center">{attestation.contribution}</p>
        </div>
        {renderAttestationDetails()}
        <div className="mb-4">
          <h3 className="font-semibold text-center">Feedback</h3>
          <p className="text-center">{('feedback' in attestation) ? attestation.feedback : (('explanation' in attestation) ? attestation.explanation : 'N/A')}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-center">Date</h3>
          <p className="text-center">
            {format(new Date(attestation.createdAt || ''), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="mb-4 text-center">
          <Link href={attestationLink}>
            <button className='btn'>
              View on EAS
            </button>
          </Link>
        </div>
        <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AttestationModalView;