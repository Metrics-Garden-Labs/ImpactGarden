'use client';

import React, { useState } from 'react';
import SearchProjects from './searchProjects';
import ProjectList from './projectList1';
import { Project, SearchResult } from '../../src/types';

interface Props {
  projects: Project[];
  query: string;
  filter: string;
  sortOrder: string;
  searchResults: SearchResult[];
  error?: string;
}

const ProjectPageClient = ({ projects, query, filter, sortOrder, searchResults, error }: Props) => {
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
    setSelectedSortOrder(newSortOrder);
  };

  return (
    <div className="bg-white text-black">
      <SearchProjects 
        onSearchResults={handleSearchResults}
        onFilterChange={handleFilterChange}
        onSortOrderChange={handleSortOrderChange} 
      />
      {error ? (
        <p>{error}</p>
      ) : (
        <ProjectList
          projects={projects}
          query={query}
          filter={selectedFilter}
          sortOrder={selectedSortOrder}
          searchResults={localSearchResults}
        />
      )}
    </div>
  );
};

export default ProjectPageClient;
