import React from 'react';
import { Contribution, Project } from '@/src/types';
import Link from 'next/link';
import { FaCopy } from 'react-icons/fa';

interface ContributionDetailsProps {
  contribution: Contribution;
  project: Project;
  setIsAttestationModalOpen: (isOpen: boolean) => void;
  copyToClipboard: () => void;
}

const ContributionDetails: React.FC<ContributionDetailsProps> = ({
  contribution,
  project,
  setIsAttestationModalOpen,
  copyToClipboard,
}) => {
  return (
    <>
      <div className="text-left pt-8 p-2">

        <h2 className="text-xl font-bold mb-4">
          {contribution.contribution}
        </h2>

        <h3 className="font-semibold text-left">{contribution.category}</h3>
        <h3 className="font-semibold text-left">{contribution.subcategory}</h3>
      </div>

      <div className="flex">
        <hr className="border-1 border-gray-300 my-2 w-1/3" />
      </div>

      <div className="mb-4 items-left py-3 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-left">Description</h3>
        <p className="text-left">{contribution.desc}</p>
      </div>

      {contribution.link && (
        <div className="mb-4 justify-start items-center overflow-y-auto">
          <h3 className="font-semibold text-left">Link/Evidence</h3>
          <div className="flex justify-start items-center">
            <Link
              href={contribution.link || ""}
              className="text-gray-500 hover:text-gray-300 visited:text-indigo-600 flex items-center"
            >
              <p className='text-left'>{contribution.link}</p>
            </Link>
          </div>
        </div>
      )}
      
      <div className="flex justify-start mt-2">
        <button 
          className="btn bg-headerblack text-white hover:bg-gray-200 items-center justify-center hover:text-black px-2 py-1"
          onClick={() => setIsAttestationModalOpen(true)}
        >
          Endorse
        </button>
        <button
          className="btn text-center bg-headerblack text-white hover:bg-blue-500 ml-2"
          onClick={copyToClipboard}
        >
          Share<FaCopy className="ml-1" />
        </button>
      </div>
    </>
  );
};

export default ContributionDetails;