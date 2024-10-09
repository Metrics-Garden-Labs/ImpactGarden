'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import SearchProjects from './searchProjects';
import ProjectList from './projectList1';
import { ContributionWithProjectsAndAttestationCount, Project, ProjectCount, SearchResult } from '../../../src/types';
import { NEXT_PUBLIC_URL } from "../../../src/config/config";
import { getContributions } from './actions';
import ContributionList from './ContributionList';

interface Props {
  projects: (Project | ProjectCount)[];
  query: string;
  filter: string;
  sortOrder: string;
  searchResults: SearchResult[];
  error?: string;
}

const ProjectPageClient = ({ projects: initialProjects, query: initialQuery, filter: initialFilter, sortOrder: initialSortOrder, searchResults: initialSearchResults, error }: Props) => {
  const [projects, setProjects] = useState<(Project | ProjectCount)[]>(initialProjects);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialSearchResults);
  const [filter, setFilter] = useState(initialFilter || "");
  const [sortOrder, setSortOrder] = useState(initialSortOrder || "A-Z");
  const [query, setQuery] = useState(initialQuery);
  const [contributions, setContributions] = useState<ContributionWithProjectsAndAttestationCount[]>([]);

  useEffect(() => {
    fetchContributions(query, filter, sortOrder);
  }, [query, filter, sortOrder]);


  // const uniqueProjects = useMemo(() => {
  //   const projectMap = new Map<string, Project | ProjectCount>();
  //   projects.forEach(project => {
  //     if (!projectMap.has(project.projectName) || 
  //         ('attestationCount' in project && 
  //          (!('attestationCount' in projectMap.get(project.projectName)!) || 
  //           project.attestationCount > (projectMap.get(project.projectName) as ProjectCount).attestationCount))) {
  //       projectMap.set(project.projectName, project);
  //     }
  //   });
  //   console.log("uniqueProjects:", Array.from(projectMap.values()).slice(0, 5));
  //   return Array.from(projectMap.values());
  // }, [projects]);

  // const fetchProjects = useCallback(async (newQuery: string, newFilter: string, newSortOrder: string) => {
  //   try {
  //     const [category, subcategory] = newFilter.split(':');
  //     const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjects`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         category,
  //         subcategory,
  //         sortOrder: newSortOrder,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("API response for projects:", data.projects.slice(0, 5));
  //       setProjects(data.projects);
  //       setSearchResults(data.searchResults || []);
  //     } else {
  //       console.error('Error fetching data');
  //     }
  //   } catch (error) {
  //     console.error('Error during fetch operation:', error);
  //   }
  // }, []);


  
  const fetchContributions = useCallback(async (newQuery: string, newFilter: string, newSortOrder: string) => {
    try {
      const [category, subcategory] = newFilter.split(':');
      console.log('Fetching contributions with:', { newQuery, category, subcategory, newSortOrder });
      
      const contributions = await getContributions(category, subcategory, newSortOrder);
      
      console.log("Server action response for contributions:", contributions.slice(0, 5));
      setContributions(contributions as unknown as ContributionWithProjectsAndAttestationCount[]);
      
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  }, [getContributions]);
  

  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery);
    // fetchProjects(newQuery, filter, sortOrder);
    fetchContributions(newQuery, filter, sortOrder);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    // fetchProjects(query, newFilter, sortOrder);
    fetchContributions(query, newFilter, sortOrder);
  };

  const handleSortOrderChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
    // fetchProjects(query, filter, newSortOrder);
    fetchContributions(query, filter, newSortOrder);
  };

  return (
    <div className="bg-white text-black">
      <SearchProjects 
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortOrderChange={handleSortOrderChange}
        currentFilter={filter}
        currentSortOrder={sortOrder}
      />
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : (
        // <ProjectList
        //   projects={projects}
        //   query={query}
        //   filter={filter}
        //   sortOrder={sortOrder}
        //   searchResults={searchResults}
        // />
        <ContributionList
          contributions={contributions}
          query={query}
          filter={filter}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default ProjectPageClient;