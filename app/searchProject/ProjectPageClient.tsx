'use client';
import React, { useState, useCallback, useMemo } from 'react';
import SearchProjects from './searchProjects';
import ProjectList from './projectList1';
import { Project, ProjectCount, SearchResult } from '../../src/types';
import { NEXT_PUBLIC_URL } from "../../src/config/config";

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

  const uniqueProjects = useMemo(() => {
    const projectMap = new Map<string, Project | ProjectCount>();
    projects.forEach(project => {
      if (!projectMap.has(project.projectName) || 
          ('attestationCount' in project && 
           (!('attestationCount' in projectMap.get(project.projectName)!) || 
            project.attestationCount > (projectMap.get(project.projectName) as ProjectCount).attestationCount))) {
        projectMap.set(project.projectName, project);
      }
    });
    console.log("uniqueProjects:", Array.from(projectMap.values()).slice(0, 5));
    return Array.from(projectMap.values());
  }, [projects]);

  const fetchProjects = useCallback(async (newQuery: string, newFilter: string, newSortOrder: string) => {
    try {
      const [category, subcategory] = newFilter.split(':');
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subcategory,
          sortOrder: newSortOrder,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response for projects:", data.projects.slice(0, 5));
        setProjects(data.projects);
        setSearchResults(data.searchResults || []);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error during fetch operation:', error);
    }
  }, []);

  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery);
    fetchProjects(newQuery, filter, sortOrder);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    fetchProjects(query, newFilter, sortOrder);
  };

  const handleSortOrderChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
    fetchProjects(query, filter, newSortOrder);
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
        <ProjectList
          projects={uniqueProjects}
          query={query}
          filter={filter}
          sortOrder={sortOrder}
          searchResults={searchResults}
        />
      )}
    </div>
  );
};

export default ProjectPageClient;