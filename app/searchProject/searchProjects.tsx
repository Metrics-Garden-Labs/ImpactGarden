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



const SearchProjects = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [ filter, setFilter ] = useState("projectName");
    const [ walletAddress ] = useGlobalState("walletAddress");
    const [ fid ] = useGlobalState("fid");
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Optimism');
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

    const handleSearch = (searchTerm: string) => {
        const params = new URLSearchParams(searchParams);
        const endpoint = networkEndpoints[selectedNetwork];
        if (searchTerm) {
            params.set("query", searchTerm);
            params.set("filter", filter);
            params.set("walletAddress", walletAddress);
            params.set("endpoint", endpoint);
        } else {
            params.delete("query");
            params.delete("filter");
            params.delete("walletAddress");
            params.delete("endpoint");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    

    return (
        <>
        <div className="relative">
        <div className="absolute top-4 right-4">
        {user.fid ? (
            <ConnectButton />
          ) : (
            <FarcasterLogin />
          )}
        </div>
        <div className="sm:col-span-4 p-4">
            <label htmlFor="network" className="block text-sm font-medium leading-6 text-gray-900">What network would you like to query?</label>
            <div className="mt-2">
                <select 
                    id="network" 
                    name="network"
                    value={selectedNetwork}
                    onChange={handleNetworkChange} 
                    autoComplete="Network" 
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">

                    <option>Ethereum</option>
                    <option>Arbitrum</option>
                    <option>Optimism</option>
                    <option>Linea</option>
                    <option>Sepolia</option>
                    <option>Base</option>
                    <option>Optimism-Goerli</option>
                    <option>Base-Goerli</option>
                </select>
            </div>
            </div>
            <div className='flex items-center px-4 space-x-4'>
            
                <div className="relative flex-grow">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <input
                        className="peer block w-full rounded-md border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        placeholder="Search projects"
                        defaultValue={searchParams.get("query")?.toString() || ""}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
    
                <div className="flex-initial">
                    <label htmlFor="shape" className="block text-sm font-medium leading-6 text-gray-900">Filter</label>
                    <div className="mb-6">
                        <select
                        id="filter"
                        name="shape"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                        <option value="projectName">Project Name</option>
                        <option value="ethAddress">Eth Address</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};

export default SearchProjects;
