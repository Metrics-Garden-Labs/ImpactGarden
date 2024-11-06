import React, { useEffect, useState } from 'react';
import { Contribution, Project } from '@/src/types';
import { FaSearch, FaChevronDown } from "react-icons/fa";
import Link from 'next/link';
import { formatOneliner } from '@/src/utils/fomatOneliner';

interface DisplayContributionsProps {
  contributions: Contribution[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setContributions: (contributions: Contribution[]) => void;
  project: Project;
}

const DisplayContributions: React.FC<DisplayContributionsProps> = ({
  contributions,
  searchTerm,
  setSearchTerm,
  setContributions,
  project,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Most Attestations');
  const [displayContributions, setDisplayContributions] = useState<Contribution[]>([]);

  // Sort contributions when the component mounts
  useEffect(() => {
    handleSortChange('Most Attestations');
  }, [contributions]); 

  const handleSortChange = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);

    let sortedContributions = [...contributions];

    if (option === 'Most Attestations') {
      sortedContributions.sort((a, b) => {
        const countA = a.attestationCount ?? 0;
        const countB = b.attestationCount ?? 0;
        return countB - countA; // Higher attestation count first
      });
    } else if (option === 'Last Update Date') {
      sortedContributions.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();
        return dateB - dateA; // Most recent first
      });
    } else if (option === 'A-Z') {
      sortedContributions.sort((a, b) => {
        const descA = (a.desc || '').trim().toLowerCase();
        const descB = (b.desc || '').trim().toLowerCase();
        return descA.localeCompare(descB, undefined, { sensitivity: 'base', ignorePunctuation: true });
      });
    }

    setDisplayContributions(sortedContributions);
  };

  const filteredContributions = displayContributions.filter((contribution) =>
    contribution.contribution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-3 bg-backgroundgray">
      <div className="mb-4 flex justify-between items-center flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/2 mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search for a contribution..."
            className="px-4 py-2 border border-lime-900/30 rounded-md w-full text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-3 text-black">
            <FaSearch />
          </span>
        </div>
        <div className="relative w-full sm:w-60">
          <button
            className="px-4 py-2 bg-backgroundgray text-black rounded-full w-full border-none text-sm flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Sort By: {selectedOption}</span>
            <FaChevronDown />
          </button>
          {isOpen && (
            <ul className="absolute left-0 mt-2 w-full bg-white border border-lime-900/30 rounded-md shadow-lg z-10">
              <li
                className="px-4 py-2 hover:bg-[#B0B0B0] cursor-pointer"
                onClick={() => handleSortChange('Most Attestations')}
              >
                Most Attestations
              </li>
              <li
                className="px-4 py-2 hover:bg-[#B0B0B0] cursor-pointer"
                onClick={() => handleSortChange('Last Update Date')}
              >
                Last Update Date
              </li>
              <li
                className="px-4 py-2 hover:bg-[#B0B0B0] cursor-pointer"
                onClick={() => handleSortChange('A-Z')}
              >
                A-Z
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
        {filteredContributions.map((contribution) => (
             <Link
             href={`/projects/${project.primaryprojectuid}/contributions/${contribution.primarycontributionuid}`}
             key={contribution.easUid}
           >
               <div
               className="flex flex-col p-4 border bg-white text-black border-lime-900/30 rounded-lg w-full h-56 shadow-lg overflow-hidden"
             >
              <div className="flex-grow flex flex-col justify-center items-center overflow-hidden">
                 <h3 className="text-lg text-center font-semibold mb-2 line-clamp-2 overflow-ellipsis">
                   {contribution.contribution}
                 </h3>
                 <p className="text-[#A6A6A6] text-sm mb-4 line-clamp-3 overflow-hidden w-full text-left sm:mx-2 md:mx-4">
                   {formatOneliner(contribution.desc)}
                 </p>
               </div>
               {/* <div className="text-left mt-auto">
                 <p className="text-[#A6A6A6] text-xs">
                   Attestations: {contribution.attestationCount}
                 </p>
               </div> */}
             </div>
           </Link>
         ))}
      </div>
    </div>
  );
};

export default DisplayContributions;
