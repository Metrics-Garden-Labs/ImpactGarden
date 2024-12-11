"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import SearchProjects from "./searchProjects";
import {
  ContributionWithProjectsAndAttestationCount,
  Project,
  ProjectCount,
  SearchResult,
} from "../../../src/types";
import { getContributions, getProjectByForCategories } from "./actions";
import ContributionList from "./ContributionList";

interface Props {
  projects: (Project | ProjectCount)[];
  query: string;
  filter: string;
  sortOrder: string;
  searchResults: SearchResult[];
  error?: string;
}

const ProjectPageClient = ({
  projects: initialProjects,
  query: initialQuery,
  filter: initialFilter,
  sortOrder: initialSortOrder,
  searchResults: initialSearchResults,
  error,
}: Props) => {
  const [projects, setProjects] =
    useState<(Project | ProjectCount)[]>(initialProjects);
  const [searchResults, setSearchResults] =
    useState<SearchResult[]>(initialSearchResults);
  const [filter, setFilter] = useState(initialFilter || "");
  const [sortOrder, setSortOrder] = useState(initialSortOrder || "A-Z");
  const [query, setQuery] = useState(initialQuery);
  const [contributions, setContributions] = useState<
    ContributionWithProjectsAndAttestationCount[]
  >([]);

  useEffect(() => {
    fetchContributions(query, filter, sortOrder);
  }, [query, filter, sortOrder]);

  const fetchContributions = useCallback(
    async (newQuery: string, newFilter: string, newSortOrder: string) => {
      try {
        let category = "";
        let subcategory = "";

        if (newFilter?.trim()?.includes(":")) {
          [category, subcategory] = newFilter.split(":");
        }
        console.log("Fetching contributions with:", {
          newQuery,
          category,
          subcategory,
          newSortOrder,
        });

        const contributions = await getContributions(
          category,
          subcategory,
          newSortOrder
        );

        const projects: Project[] = await getProjectByForCategories(
          category,
          subcategory
        );

        console.log(
          "Server action response for contributions:",
          contributions.slice(0, 5)
        );

        setProjects(projects);

        setContributions(
          contributions as unknown as ContributionWithProjectsAndAttestationCount[]
        );
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    },
    [getContributions]
  );

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
        <ContributionList
          contributions={contributions}
          query={query}
          projects={projects}
          filter={filter}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default ProjectPageClient;
