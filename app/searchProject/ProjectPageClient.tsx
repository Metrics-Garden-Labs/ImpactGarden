// app/projects/ProjectPageClient.tsx

'use client';

import React, { useState } from 'react';
import SearchProjects from './searchProjects';
import ProjectList1 from './projectList1';
import Navbar from '../components/navbar1';
import { Project, SearchResult } from '../../src/types';

interface Props {
  projects: Project[];
  query: string;
  filter: string;
  walletAddress: string;
  endpoint: string;
  sortOrder: string;
  searchResults: SearchResult[];
  error?: string;
}

const ProjectPageClient = ({ projects, query, filter, walletAddress, endpoint, sortOrder, searchResults, error }: Props) => {
  const [localSearchResults, setLocalSearchResults] = useState<SearchResult[]>(searchResults);
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const [selectedSortOrder, setSelectedSortOrder] = useState(sortOrder);

  const handleSearchResults = (results: SearchResult[]) => {
    setLocalSearchResults(results);
  };

  const handleFilterChange = (newFilter: string) => {
    setSelectedFilter(newFilter);
  };

  const handleSortOrderChange = (newSortOrder: string) => {
    console.log("Updating selectedSortOrder in ProjectPageClient:", newSortOrder);
    setSelectedSortOrder(newSortOrder);
  };

  return (
    <div className="bg-white text-black">
      <Navbar />
      <SearchProjects 
        onSearchResults={handleSearchResults}
        onFilterChange={handleFilterChange}
        onSortOrderChange={handleSortOrderChange} 
    />
      {error ? (
        <p>{error}</p>
      ) : (
        <ProjectList1
            projects={projects}
            query={query}
            filter={filter}
            walletAddress={walletAddress}
            endpoint={endpoint}
            sortOrder={selectedSortOrder} 
            searchResults={localSearchResults}
        />
      )}
    </div>
  );
};

export default ProjectPageClient;