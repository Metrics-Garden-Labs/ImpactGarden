import React from 'react';
import { Contribution, Project } from '@/src/types';
import { FaSearch } from "react-icons/fa";
import Link from 'next/link';

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
  const filteredContributions = contributions.filter((contribution) =>
    contribution.contribution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-3 bg-backgroundgray">
      <div className="mb-4 flex justify-between items-center flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/2 mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search for a contribution..."
            className="px-4 py-2 border border-gray-300 rounded-md w-full text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-3 text-black">
            <FaSearch />
          </span>
        </div>
        <select
          className="px-4 py-2 bg-backgroundgray text-black rounded-full w-full sm:w-60 border-none focus:ring-0 focus:border-none text-sm"
          onChange={(e) => {
            if (e.target.value === 'Most Attestations') {
              const sorted = [...contributions].sort((a, b) => {
                const countA = a.attestationCount ?? 0;
                const countB = b.attestationCount ?? 0;
                return countB - countA;
              });
              setContributions(sorted);
            }
          }}
        >
          <option>Sort by: Most Attestations</option>
        </select>
      </div>
      <div className="mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
        {filteredContributions.map((contribution) => (
          <Link
            href={`/projects/${project.projectName}/contributions/${contribution.id}`}
            key={contribution.id}
          >
            <div
              className="flex flex-col justify-between p-2 sm:p-2 border bg-white text-black border-gray-300 rounded-lg w-full h-56 shadow-lg"
            >
              <div className="flex-grow overflow-hidden">
                <h3 className="text-xl sm:text-lg font-semibold pb-2">
                  {contribution.contribution}
                </h3>
                <p className="text-gray-500 text-md sm:text-base overflow-hidden overflow-ellipsis">
                  {contribution.desc}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Attestations: {contribution.attestationCount}
                </p>
              </div>
              <div className="text-center">
                <button className="btn w-2/3">View Contribution</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DisplayContributions;
