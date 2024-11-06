import React, { useState } from 'react';
import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { ContributionWithProjectsAndAttestationCount, Project } from '../../../src/types';
import AttestationModal2 from '../projects/AttestationModal2';
import { formatOneliner } from '@/src/utils/fomatOneliner';

interface ContributionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contribution: ContributionWithProjectsAndAttestationCount | null;
}

const ContributionReviewModal: React.FC<ContributionReviewModalProps> = ({ isOpen, onClose, contribution }) => {
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!isOpen || !contribution) return null;

  const urlHelper = (url: string) => {
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  const openAttestationModal = () => setIsAttestationModalOpen(true);
  const closeAttestationModal = () => setIsAttestationModalOpen(false);

  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);

  const description = contribution.description || '';

  // Threshold length to determine if the "Show more" button should be displayed
  const DESCRIPTION_PREVIEW_LENGTH = 300; // Adjust this value as needed

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div
          className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-2/3 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-black">
            <RxCross2 className="w-6 h-6" />
          </button>

          <div className="text-center pt-4">
            <h2 className="text-2xl font-semibold mb-2">{contribution.projectName}</h2>
          </div>

          {contribution.projectName !== contribution.contribution && (
            <div className="my-3 text-center">
              <h3 className="font-medium text-lg">{contribution.contribution}</h3>
            </div>
          )}

          <hr className="border-lime-900/30 my-4 mx-auto w-1/2" />

          <div className="py-3">
            <h3 className="font-semibold text-center">Description</h3>
            <p
              className={`text-gray-600 text-sm mt-1 px-4 leading-relaxed ${
                isDescriptionExpanded ? '' : 'line-clamp-6'
              }`}
            >
              {formatOneliner(description)}
            </p>
            {description.length > DESCRIPTION_PREVIEW_LENGTH && (
              <div className='flex justify-center'>
              <button
                onClick={toggleDescription}
                className="mt-2 text-gray-600 text-center hover:text-black text-sm flex items-center gap-1"
              >
                {isDescriptionExpanded ? (
                  <>
                    Show less <IoIosArrowUp />
                  </>
                ) : (
                  <>
                    Show more <IoIosArrowDown />
                  </>
                )}
              </button>
              </div>
            )}
          </div>

          {contribution.link && (
            <div className="my-4">
              <h3 className="font-semibold text-center">Links</h3>
              <div className="text-center text-gray-600 text-sm mt-1 px-4 space-y-2">
                {contribution.link.split('\n').map((link, index) => (
                  <Link key={index} href={urlHelper(link)}>
                    <span className="hover:text-blue-600 text-indigo-500 break-words block">
                      {formatOneliner(link)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}


          <div className="flex justify-center mt-6 gap-4">
            <button
              className="btn btn-primary px-6 py-1 mt-2 bg-[#424242] text-white font-thin rounded-md hover:bg-black"
              onClick={openAttestationModal}
            >
              Rate Contribution
            </button>
            <Link href={`/projects/${encodeURIComponent(contribution?.primaryprojectuid || '')}`}>
              <button className="btn btn-primary px-6 py-1 mt-2 bg-[#424242] text-white font-thin rounded-md hover:bg-black">
                View Project Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {isAttestationModalOpen && (
        <AttestationModal2
          isOpen={isAttestationModalOpen}
          onClose={closeAttestationModal}
          contribution={contribution}
          project={project}
        />
      )}
    </>
  );
};

export default ContributionReviewModal;
