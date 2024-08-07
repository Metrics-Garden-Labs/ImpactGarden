import { FaSearch } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useGlobalState } from "../../src/config/config";
import { NetworkType } from '../../src/utils/graphqlEndpoints';
import React from "react";
import useLocalStorage from "@/src/hooks/use-local-storage-state";
import { Project, SearchResult } from "@/src/types";
import { NEXT_PUBLIC_URL } from "../../src/config/config";
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  onSearchResults: (results: SearchResult[]) => void;
  onFilterChange: (filter: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
}

const SearchProjects = ({ onSearchResults, onFilterChange, onSortOrderChange }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filter, setFilter] = useState("projectName");
  const [walletAddress] = useGlobalState("walletAddress");
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Optimism');
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });

  const [isPending, startTransition] = useTransition();

  const options = ["Project Name", "Recently Added", "Projects on Optimism", "Most Attested", "Best Rated"];

  console.log('walletAddress', walletAddress);

  useEffect(() => {
    handleSearch(searchParams.get("query") || "");
  }, [selectedFilter, sortOrder]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
    handleSearch(searchParams.get("query") || "");
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    onSortOrderChange(newSortOrder);
    handleSearch(searchParams.get("query") || "");
  };

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      const params = new URLSearchParams(searchParams);

      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }
      params.set("filter", selectedFilter);
      params.set("sortOrder", sortOrder);

      replace(`${pathname}?${params.toString()}`);

      try {
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchTerm,
            filter: selectedFilter,
            sortOrder,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          startTransition(() => {
            setSearchResults(data.projects);
            onSearchResults(data.projects);
          });
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error during fetch operation:', error);
      }
    }, [searchParams, selectedFilter, sortOrder, replace, pathname, onSearchResults]
  );

  const debouncedHandleSearch = useDebouncedCallback(handleSearch, 500);

  return (
    <div className="bg-white">
      <div className='container mx-auto px-4 max-w-6xl bg-white'>
        <h1 className="text-2xl font-semibold mt-10 mb-10">Explore Projects</h1>
        <hr className="border-t border-gray-300 my-4" />
        <div className='flex flex-col sm:flex-row justify-between bg-white items-center mt-6 mb-5 px-0 space-y-4 sm:space-y-0'>
          <div className="flex flex-col sm:flex-row flex-grow space-y-4 sm:space-y-0 sm:space-x-4 bg-white w-full sm:w-auto">
            <div className="relative w-full sm:w-5/12">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                className="w-full rounded-md border-gray-200 py-3 pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Search projects"
                defaultValue={searchParams.get("query")?.toString() || ""}
                onChange={(e) => debouncedHandleSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 h-[20px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="w-full sm:w-48 border border-gray-300 rounded-md">
              <select
                id="filter"
                name="filter"
                value={selectedFilter}
                onChange={handleFilterChange}
                className="block w-full px-4 py-2 text-gray-900 bg-white border-0 rounded-md focus:outline-none focus:ring-0 focus:border-0 appearance-none"
              >
                <option value="">Filters</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              id="sortOrder"
              name="sortOrder"
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option value="">Sort by: A-Z</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
        </div>
        {selectedFilter && (
          <div className="mb-10">
            <div className="inline-block bg-white text-gray-800 text-sm font-medium py-2 px-4 rounded-md border">
              {selectedFilter}
              <button className="ml-2 text-gray-600 hover:text-gray-800" onClick={() => setSelectedFilter('')}>✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProjects;
