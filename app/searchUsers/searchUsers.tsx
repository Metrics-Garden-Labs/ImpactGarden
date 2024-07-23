'use client';

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

const SearchUsers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filter, setFilter] = useState("username");
  const [verificationFilter, setVerificationFilter] = useState(searchParams.get("verificationFilter") || "");

  const [isPending, startTransition] = useTransition();

  const handleSearch = (searchTerm: string) => {
    startTransition(() => {
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
    });
  };

  const debouncedHandleSearch = useDebouncedCallback((searchTerm: string) => {
    handleSearch(searchTerm);
  }, 500);

  const handleVerificationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVerificationFilter = e.target.value;
    setVerificationFilter(newVerificationFilter);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (newVerificationFilter) {
        params.set("verificationFilter", newVerificationFilter);
      } else {
        params.delete("verificationFilter");
      }
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 max-w-6xl bg-white ">
        <h1 className="text-2xl font-semibold mt-10 mb-10">Explore Attestors</h1>
        <hr className="border-t border-gray-300 my-4"/>

        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 justify-between bg-white items-center mt-6 mb-10 px-0'>
          <div className="flex flex-col sm:flex-row sm:flex-grow sm:space-x-4 bg-white w-full">
            <div className="relative w-full sm:w-1/2 md:w-2/5 mb-4 sm:mb-0">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                className="w-full rounded-md border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Search users"
                defaultValue={searchParams.get("query")?.toString() || ""}
                onChange={(e) => debouncedHandleSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="relative w-full sm:w-1/2 md:w-1/5">
              <select
                id="verificationFilter"
                name="verificationFilter"
                value={verificationFilter}
                onChange={handleVerificationFilterChange}
                className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-0 appearance-none"
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
