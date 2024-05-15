//this is going to be a seaarch function for all the attestations that we add to the db

//do a little bit of research then send it

//end game would be to pick between querying eas and our own db

//use mix of server adn client side rendering

'use client';

import { FaSearch } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../src/config/config";
import { NetworkType, networkEndpoints } from '../components/graphqlEndpoints';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import FarcasterLogin from "../components/farcasterLogin";
import useLocalStorage from "@/src/hooks/use-local-storage-state";
import { getProjectsByFids } from "@/src/lib/db";
import { Project, SearchResult } from "@/src/types";
import { NEXT_PUBLIC_URL } from "../../src/config/config";


interface Props {
    onSearchResults: (results: SearchResult[]) => void;
    onFilterChange: (filter: string) => void;
    onSortOrderChange: (sortOrder: string) => void;
  }

const SearchProjects = ({ onSearchResults, onFilterChange, onSortOrderChange }: Props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [ filter, setFilter ] = useState("projectName");
    const [ walletAddress ] = useGlobalState("walletAddress");
    const [ fid ] = useGlobalState("fid");
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Optimism');
    const [ sortOrder, setSortOrder] = useState("asc");
    const [ searchResults, setSearchResults ] = useState<SearchResult[]>([]);
    const [ selectedFilter, setSelectedFilter ] = useState("");
    const[ user ] = useLocalStorage("user", {
        fid: '',
        username: '',
        ethAddress: '',
    });

    const options = ["Proejct Name" ,"Farcaster Engagement" ,"Recently Added","Projects on Optimism", "Projects on Celo", "Projects on Base"]
    console.log('walletAddress', walletAddress);

    useEffect(() => {
        const initialQuery = searchParams.get("query") || "";
        handleSearch(initialQuery);
        }, []);
        

    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as NetworkType;
        setSelectedNetwork(value);
        
        console.log("Selected network", value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = e.target.value;
        setSelectedFilter(newFilter);
        onFilterChange(newFilter);
        handleSearch(searchParams.get("query") || "");
    };
    
    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortOrder = e.target.value;
        setSortOrder(newSortOrder);
        console.log("Selected sortOrder:", newSortOrder);
        onSortOrderChange(newSortOrder);
      };
    

    const handleSearch = async (searchTerm : string) => {
    // Only make an API call if a specific filter is selected
    if (selectedFilter) {
        const params = new URLSearchParams(searchParams);
        const endpoint = networkEndpoints[selectedNetwork];

        if (searchTerm) {
            params.set("query", searchTerm);
            params.set("filter", filter);
            params.set("walletAddress", walletAddress);
            params.set("endpoint", endpoint);
            params.set("sortOrder", sortOrder);
        } else {
            params.delete("query");
            params.delete("filter");
            params.delete("walletAddress");
            params.delete("endpoint");
            params.delete("sortOrder");
        }
        replace(`${pathname}?${params.toString()}`);

        console.log(`Filter selected: ${selectedFilter}`);
        console.log(`Making API call with query: ${searchTerm}, filter: ${selectedFilter}, walletAddress: ${walletAddress}, endpoint: ${endpoint}, sortOrder: ${sortOrder}`);

       
  try {
    let response;
    if (selectedFilter === "Projects on Optimism") {
      response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectsEcosystem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          filter: selectedFilter,
          walletAddress,
          endpoint,
          sortOrder,
        }),
      });
    } else if (selectedFilter === "Most Engaged") {
      const apifid = user.fid;
      response = await fetch(`${NEXT_PUBLIC_URL}/api/karmalabfarcasterrep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apifid }),
      });
    }

    if (response && response.ok) {
      const data = await response.json();
      console.log('Fetched Data:', data);
        if (selectedFilter === "Most Engaged") {
          // Handle Farcaster Engagement data
          const farcasterData: SearchResult[] = data.farcasterData;
          setSearchResults(farcasterData);
          onSearchResults(farcasterData);
        } else {
          const searchData = data;
          setSearchResults(searchData);
          onSearchResults(searchData);
        }
    } else {
        console.error('Error fetching data');
      }
  } catch (error) {
    console.error('Error during fetch operation:', error);
  }
};
};
    
    
   

    return (
        <div className="bg-white">
        <div className='container mx-auto px-4 max-w-6xl bg-white'>
            <h1 className="text-2xl font-semibold mt-10 mb-10">Explore Projects</h1>
            <hr className="border-t border-gray-300 my-4"/>
    
            <div className='flex justify-between bg-white items-center mt-6 mb-5 px-0'>  {/* Adjusted padding here */}
                <div className="flex flex-grow space-x-4 bg-white">
                    <div className="relative w-5/12 ">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <input
                            className="w-full rounded-md border-gray-200 py-3 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            placeholder="Search projects"
                            defaultValue={searchParams.get("query")?.toString() || ""}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 h-[20px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    
                    <div className="w-48 border border-gray-300 rounded-md">
                    <select
                        id="filter"
                        name="filter"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        className="block w-full px-4 py-2 text-gray-900 bg-white border-0 rounded-md focus:outline-none focus:ring-0 focus:border-0 appearance-none"
                    >
                        <option value="">Filters</option>
                        <option value="Project Name" className="flex items-center">
                        <span className="w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center">
                            {selectedFilter === 'Project Name' && (
                            <span className="w-2 h-2 bg-black rounded-full"></span>
                            )}
                        </span>
                        Project Name
                        </option>
                        <option value="Most Engaged" className="flex items-center">
                        <span className="w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center">
                            {selectedFilter === 'Most Engaged' && (
                            <span className="w-2 h-2 bg-black rounded-full"></span>
                            )}
                        </span>
                        Farcaster Engagement 
                        </option>
                        <option value="Recently Added" className="flex items-center">
                        <span className="w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center">
                            {selectedFilter === 'Recently Added' && (
                            <span className="w-2 h-2 bg-black rounded-full"></span>
                            )}
                        </span>
                        Recently Added
                        </option>

                        <option value="Projects on Optimism" className="relative flex items-center py-2">
                            <span className={`w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center ${selectedFilter === 'Projects on Optimism' ? 'bg-black' : ''}`}>
                            {selectedFilter === 'Projects on Optimism' && (
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                            )}
                            </span>
                            Projects on Optimism
                        </option>
                        <option value="Projects on Celo" className="relative flex items-center py-2">
                            <span className={`w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center ${selectedFilter === 'Projects on Celo' ? 'bg-black' : ''}`}>
                            {selectedFilter === 'Projects on Celo' && (
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                            )}
                            </span>
                            Projects on Celo
                        </option>
                        <option value="Projects on Base" className="relative flex items-center py-2">
                            <span className={`w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center ${selectedFilter === 'Projects on Base' ? 'bg-black' : ''}`}>
                            {selectedFilter === 'Projects on Base' && (
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                            )}
                            </span>
                            Projects on Base
                        </option>
                        </select>
                    </div>

                    </div>
                    <div className="flex-initial">
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
                    


                {/* ADD THE KARMA API FILTER HERE FOR FARCASTER ENGAGEMENT
                the premise is that you can see projects based on your most engaged with profiles in farcaster
                then based in the optimism channel
                then based in the base channel */}
            

                </div>
                {/* Display active filters */}
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

      
    )

};


export default SearchProjects;
