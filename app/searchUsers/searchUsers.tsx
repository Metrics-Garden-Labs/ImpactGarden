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

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("query", searchTerm);
      params.set("filter", filter);
    } else {
      params.delete("query");
      params.delete("filter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center px-4 space-x-4">
      <div className="relative  flex-grow">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search users"
          defaultValue={searchParams.get("query")?.toString() || ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>

      <div className="flex-initial">
        <label htmlFor="shape" className="block text-sm font-medium leading-6 text-gray-900 mt-3">Filter</label>
        <div className="mb-8">
          <select
            id="filter"
            name="shape"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="username">Username</option>
            <option value="fid">FID</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;