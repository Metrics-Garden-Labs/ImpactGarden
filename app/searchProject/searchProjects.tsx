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
import { SearchResult } from "@/src/types";
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
    console.log('walletAddress', walletAddress);

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
        
        const apifid = user.fid;
        // Make a POST request to the internal API route
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/karmalabfarcasterrep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({apifid}),
            // Adjust request body as needed
        });
        if (response.ok) {
        const data: SearchResult[] = await response.json();
        console.log('Farcaster Data:', data);
        setSearchResults(data);
        onSearchResults(data);
        // Update the state with the fetched data
        } else {
        console.error('Error fetching farcaster data');
        return null;
        }
    }
    };
    
    
    useEffect(() => {
    const initialQuery = searchParams.get("query") || "";
    handleSearch(initialQuery);
    }, []);

    return (
        <div className="bg-white">
        <div className='container mx-auto px-4 max-w-6xl bg-white'>
            <h1 className="text-2xl font-semibold mt-10 mb-10">Explore Projects</h1>
            <hr className="border-t border-gray-300 my-4"/>
    
            <div className='flex justify-between bg-white items-center mt-6 mb-10 px-0'>  {/* Adjusted padding here */}
                <div className="flex flex-grow space-x-4 bg-white">
                    <div className="relative w-1/3">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <input
                            className="w-full rounded-md border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            placeholder="Search projects"
                            defaultValue={searchParams.get("query")?.toString() || ""}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
    
                    <div className="w-1/6">
                        <select
                            id="filter"
                            name="filter"
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option value="">Filters</option>
                            <option value="projectName">Project Name</option>
                            <option value="most-engaged">Most Engaged</option>
                            <option value="recently-added">Recently Added</option>
                        </select>
                    </div>
                </div>

                        <div className="flex-initial">
                            <select
                            id="sortOrder"
                            name="sortOrder"
                            value={sortOrder}
                            onChange={handleSortOrderChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                            <option value="">Sort by: A-Z</option>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                            </select>
                        </div>
                    </div>

                {/* ADD THE KARMA API FILTER HERE FOR FARCASTER ENGAGEMENT
                the premise is that you can see projects based on your most engaged with profiles in farcaster
                then based in the optimism channel
                then based in the base channel */}
            

                </div>
            </div>
      
    )
};

export default SearchProjects;
