// searchUsers.tsx
'use client';

import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const SearchUsers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filter, setFilter] = useState("username");
 const [verificationFilter, setVerificationFilter] = useState("");

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("query", searchTerm);
      params.set("filter", filter);
    } else {
      params.delete("query");
      params.delete("filter");
    }
    params.set("verificationFilter", verificationFilter)
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="container mx-auto pt-5 ">
        <h1 className="text-3xl font-semibold mt-10 mb-10">Explore Attestors</h1>
        <hr className="border-t border-gray-300 my-4"/>
        <div className="flex justify-start items-center max-w-4xl">  
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg text-md placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search attestors..."
              defaultValue={searchParams.get("query")?.toString() || ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
         
          <div className="flex-initial">
            <label htmlFor="filter" className="block text-md font-medium text-gray-900 mt-8"></label>
            <div className="mb-8">          
              <select
                id="filter"
                name="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-48 h-12 border rounded-lg text-gray-900 bg-white"
              >
                <option value="filter">Filter</option>
                <option value="username">Username</option>
                <option value="coinbaseVerified">Coinbase Verified</option>
                <option value="opBadgeholder">Optimism Badgeholder</option>
                <option value="powerBadgeholder">Farcaster Power User</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchUsers;
            

 

        