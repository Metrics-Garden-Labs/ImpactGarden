import React from 'react';
import { Contribution, Project } from '@/src/types';
import Link from 'next/link';
import { FaCopy } from 'react-icons/fa';
import { formatOneliner, splitLinks } from '@/src/utils/fomatOneliner';

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
      <div className="text-left w-full pt-8 p-2">

        <h2 className="text-xl font-bold mb-4">
          {contribution.contribution}
        </h2>

        <h3 className="font-semibold text-left">{contribution.category}</h3>
        <h3 className="font-semibold text-left">{contribution.subcategory}</h3>
      

      <div className="flex">
        <hr className="border-1 border-gray-300 my-2 w-1/3" />
      </div>

      <div className="mb-4 items-left py-3 ">
        <h3 className="font-semibold text-left">Description</h3>
        <p className="text-left">{formatOneliner(contribution.desc)}</p>
      </div>

      {contribution.link && (
        <div className="mb-4 justify-start items-center ">
          <h3 className="font-semibold text-left">Link/Evidence</h3>
          <div className="flex flex-col justify-start">
            {splitLinks(contribution.link).map((link, index) => (
              <Link
                key={index}
                href={contribution.link || ""}
                className="text-gray-500 underline hover:text-[#2C3F2D] transition-colors duration-200"
              >
                <p className='text-left'>{link}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-start mt-2 pr-2">
      <button
          className="btn text-center font-medium text-gray-700 underline shadow-none border-none "
          onClick={copyToClipboard}
        >
          Share<FaCopy className="ml-1" />
        </button>

        <button 
          className="btn bg-headerblack text-white hover:bg-gray-200 items-center justify-center hover:text-black px-2 py-1"
          onClick={() => setIsAttestationModalOpen(true)}
        >
          Endorse
        </button>
        
      </div>
      </div>
    </>
  );
};

export default ContributionDetails;
