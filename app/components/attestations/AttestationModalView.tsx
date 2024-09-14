import React, { useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { RxCross2 } from 'react-icons/rx';
import { Attestation2, AttestationDisplay, AttestationNetworkType } from '@/src/types';
import { easScanEndpoints } from '../../../src/utils/easScan';
import Image from 'next/image';
import { getSmileyRatingEmoji, SmileyRatingSection } from '@/src/utils/helpers';
import { RatingSection, renderStars10, renderStars5 } from '../ui/RenderStars';

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
    console.log('category', attestation.category);
    console.log('subcategory', attestation.subcategory);

    if ('category' in attestation) {
      switch (attestation.category) {
        case "Onchain Builders":
          return (
            <>
                  <div className="mb-4 flex justify-between items-center">
                  {/* Rating Section */}
                  <div className="flex-grow mr-2">
                    <RatingSection
                      title="Would recommend"
                      rating={Number(attestation.recommend_contribution) ?? 0}
                      renderStars={renderStars10}
                      scaleFactor={2}
                    />
                  </div>

                  {/* Smiley Rating Section */}
                  {attestation.feeling_if_didnt_exist && (
                    <div className="flex-grow">
                      <SmileyRatingSection
                        title="Absence of Contribution"
                        description={attestation.feeling_if_didnt_exist}
                        inline={true}
                      />
                    </div>
                  )}
                </div>
                </>
          );
        case "OP Stack":
          return (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 text-center">Absence of Contribution</h3>
                <p className="text-center">{getSmileyRatingEmoji(attestation.feeling_if_didnt_exist || "")}</p>
                <p className="text-center text-xs text-gray-500">{attestation.feeling_if_didnt_exist || 'N/A'}</p>
              </div>
            </>
          );
        case "Governance":
          switch (attestation.subcategory) {
            case "Infra & Tooling":
              return (
                <>
                  <div className="mb-4 flex justify-between items-center">
                  {/* Rating Section */}
                  <div className="flex-grow mr-2">
                    <RatingSection
                      title="Would recommend"
                      rating={Number(attestation.likely_to_recommend) ?? 0}
                      renderStars={renderStars10}
                      scaleFactor={2}
                    />
                  </div>

                  {/* Smiley Rating Section */}
                  {attestation.feeling_if_didnt_exist && (
                    <div className="flex-grow">
                      <SmileyRatingSection
                        title="Absence of Contribution"
                        description={attestation.feeling_if_didnt_exist}
                        inline={true}
                      />
                    </div>
                  )}
                </div>
                </>
              );
            case "Governance Research & Analytics":
              return (
                <>
                <div className="mb-4 flex justify-center">
                  {/* Recommendability */}
                  <RatingSection
                    title="Recommendability"
                    rating={Number(attestation.likely_to_recommend) ?? 0}
                    renderStars={renderStars10}
                    scaleFactor={2}  
                  />

                  {/* Understanding Governance */}
                  <RatingSection
                    title="Understanding Governance"
                    rating={Number(attestation.useful_for_understanding) ?? 0}
                    renderStars={renderStars5}
                  />

                  {/* Impact on Governance */}
                  <RatingSection
                    title="Impact on Governance"
                    rating={Number(attestation.effective_for_improvements) ?? 0}
                    renderStars={renderStars5}
                  />
                </div>
                </>
              );
            case "Collaboration & Onboarding":
              return (
                <>
                  {/* <div className="mb-4">
                    <h3 className="font-semibold text-center">Governance Knowledge</h3>
                    <p className="text-center">{attestation.governance_knowledge || 'N/A'}</p>
                  </div> not on the figma?*/}
                  <div className="flex justify-between items-center">
                  <div className="flex-grow mr-2">
                    <RatingSection
                      title="Would recommend"
                      rating={Number(attestation.recommend_contribution) ?? 0}
                      renderStars={renderStars10}
                      scaleFactor={2}
                    />
                  </div>
                  <div className="flex-grow">
                    {attestation.feeling_if_didnt_exist && (
                  <SmileyRatingSection
                        title="Absence of Contribution"
                        description={attestation.feeling_if_didnt_exist}
                      />
                    )}
                  </div>
                  </div>
                  {/* <div className="mb-4">
                    <h3 className="font-semibold text-center">Explanation</h3>
                    <p className="text-center">{attestation.explanation || 'N/A'}</p>
                  </div> */}
                </>
              );
            case "Governance Structures":
              return (
                <>
                  <div className="mb-4">
                    {attestation.feeling_if_didnt_exist && (
                  <SmileyRatingSection
                        title="Absence of Contribution"
                        description={attestation.feeling_if_didnt_exist}
                      />
                    )}
                  </div>
                  {/* <div className="mb-4">
                    <h3 className="font-semibold text-center">Examples of Usefulness</h3>
                    <p className="text-center">{attestation.examples_of_usefulness || 'N/A'}</p>
                  </div> */}
                  {/* <div className="mb-4">
                    <h3 className="font-semibold text-center">Explanation</h3>
                    <p className="text-center">{attestation.explanation || 'N/A'}</p>
                  </div> */}
                </>
              );
            default:
              return null;
          }
        default:
          return null;
      }
    } else {
      return (
        <>
          {attestation.rating && (
            <div className="mb-4">
              <RatingSection
                    title="Rating"
                    rating={Number(attestation.rating) ?? 0}
                    renderStars={renderStars5}
                  />
            </div>
          )}
          {('improvementareas' in attestation) && attestation.improvementareas && (
            <div className="mb-4">
              <h3 className="text-lg text-center mb-3">Improvement Areas</h3>
              <p className="text-center text-sm text-gray-500">{attestation.improvementareas}</p>
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
          <h2 className="text-xl font-bold">{attestation.contribution}</h2>
          <h3 className="text-md  mb-4">{attestation.subcategory || ""}</h3>
        </div>
        <div className="text-center flex items-center justify-center">
          {attestation.pfp && (
            <div className="mr-2 rounded-full border-2 border-gray-300 shadow-md p-1">
              <Image
                src={attestation.pfp}
                alt={attestation.username || ""}
                width={40}
                height={40}
                className='rounded-full'
              />
            </div>
          )}
          <Link href={`/users/${attestation.username}`}>
          <p className="text-center font-semibold text-lg">{attestation.username}</p>
          </Link>
        </div>
        <hr className="border-1 border-gray-300 my-2 mx-auto w-1/4 mt-3" />
        {renderAttestationDetails()}
        <div className="mb-5">
          <h3 className="text-lg text-center mb-3">Explanation</h3>
          <p className="text-center text-sm text-gray-500">{('feedback' in attestation) ? attestation.feedback : (('explanation' in attestation) ? attestation.explanation : 'N/A')}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg text-center mb-3">Date</h3>
          <p className="text-center text-sm text-gray-500">
            {format(new Date(attestation.createdAt || ''), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="mb-4 text-center">
          <Link href={attestationLink}>
            <button className='btn bg-headerblack text-white text-xs hover:bg-gray-200 items-center justify-center hover:text-black px-4 py-1'>
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