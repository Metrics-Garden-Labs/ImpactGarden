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
  const [verificationFilter, setVerificationFilter] = useState(searchParams.get("verificationFilter") || "");

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }
    params.set("filter", filter);
    if (verificationFilter) {
      params.set("verificationFilter", verificationFilter);
    } else {
      params.delete("verificationFilter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleVerificationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVerificationFilter(e.target.value);
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("verificationFilter", e.target.value);
    } else {
      params.delete("verificationFilter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="container mx-auto px-4 max-w-6xl bg-white ">
        <h1 className="text-2xl font-semibold mt-10 mb-10">Explore Attestors</h1>
        <hr className="border-t border-gray-300 my-4"/>

        <div className='flex justify-between bg-white items-center mt-6 mb-10 px-0'>
          <div className="flex flex-grow space-x-4 bg-white">
            <div className="relative w-1/3">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                className="w-full rounded-md border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Search users"
                defaultValue={searchParams.get("query")?.toString() || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
         
            {/* <div className="w-1/6">
              <select
                id="filter"
                name="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="username">Username</option>
                <option value="fid">FID</option>
              </select>
            </div> */}

            <div className="w-1/6">
              <select
                id="verificationFilter"
                name="verificationFilter"
                value={verificationFilter}
                onChange={handleVerificationFilterChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="">Username</option>
                <option value="coinbaseVerified">Coinbase Verified</option>
                <option value="opBadgeholder">OP Badgeholder</option>
                <option value="powerBadgeholder">Power Badgeholder</option>
                <option value="delegate">Delegate</option>
                <option value="s4Participant">S4 Participant</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SearchUsers;
