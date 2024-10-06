import { higherCategoryKey } from '@/src/types';
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
  currentFilter: string;
  currentSortOrder: string;
}

const categories: higherCategoryKey[] = ["Governance"];
// "OP Stack", "Onchain Builders"

const subcategories = {
	Governance: ["Infra & Tooling", "Research & Analytics", "Collaboration and Onboarding", "Governance Leadership"],
  "OP Stack": ["Ethereum Core Contributions", "OP Stack Research and Development", "OP Stack Tooling"],
  "Onchain Builders": ["CeFi", "Crosschain", "DeFi", "Governance", "NFT", "Social", "Utilities"],
};

const sortOptions = ["A-Z", "Recently Added", "Most Attested", "Z-A"];

const SearchProjects = ({ onSearchChange, onFilterChange, onSortOrderChange, currentFilter, currentSortOrder }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentFilter) {
      const [category, subcategory] = currentFilter.split(':');
      setSelectedCategory(category as higherCategoryKey || "");
      setSelectedSubcategory(subcategory || "");
    } else {
      setSelectedCategory("");
      setSelectedSubcategory("");
    }
    console.log("Current Filter:", currentFilter);
  }, [currentFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const debouncedSearch = useDebouncedCallback(
    (value) => onSearchChange(value),
    300
  );

  const handleCategoryChange = (category: string) => {
    if (selectedCategory === category) {
      setOpenCategory(openCategory === category ? null : category);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory("");
      setOpenCategory(category);
      onFilterChange(category);
    }
    setIsFilterOpen(true); // Keep the filter open after selection
  };

  const handleSubcategoryChange = (subcategory: string) => {
	const associatedCategory = Object.keys(subcategories).find((category) =>
	  subcategories[category as higherCategoryKey].includes(subcategory)
	);
	if (selectedSubcategory === subcategory) {
	  setSelectedSubcategory("");
	  onFilterChange(selectedCategory);  
	} else {
	  if (associatedCategory && !selectedCategory) {
		setSelectedCategory(associatedCategory as higherCategoryKey);
	  }
	  setSelectedSubcategory(subcategory);
	  onFilterChange(`${associatedCategory || selectedCategory}:${subcategory}`);
	}

	setIsFilterOpen(false); // Close the filter menu after selection
  };
  

  const handleSortOrderChange = (newSortOrder: string) => {
    onSortOrderChange(newSortOrder);
    setIsSortOpen(false);
  };

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
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 h-[20px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="relative w-full sm:w-56" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none flex justify-between items-center truncate"
              >
                <span>{selectedCategory || selectedSubcategory ? `${selectedCategory}${selectedSubcategory ? `` : ''}` : 'Select Category'}</span>
                <FaChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {categories.map((category) => (
                    <div key={category} className="p-2">
                      <button
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left p-2 flex justify-between items-center rounded-md ${selectedCategory === category ? 'bg-[#B0B0B0]' : 'hover:bg-[#B0B0B0]'}`}
                      >
                        <span>{category}</span>
                        {subcategories[category].length > 0 && (
                          openCategory === category ? <FaChevronUp /> : <FaChevronDown />
                        )}
                      </button>
                      {openCategory === category && subcategories[category].length > 0 && (
                        <div className="ml-4">
                          {subcategories[category].map((subcategory) => (
                            <button
							disabled
                              key={subcategory}
                              onClick={() => handleSubcategoryChange(subcategory)}
                              className={`w-full text-left p-2  cursor-not-allowed rounded-md ${selectedSubcategory === subcategory ? 'bg-[#B0B0B0]' : 'hover:bg-[#B0B0B0]'}`}
                            >
                              {subcategory}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative w-full sm:w-auto" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none"
            >
              Sort by: {currentSortOrder}
            </button>
            {isSortOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortOrderChange(option)}
                    className="w-full text-left hover:bg-[#B0B0B0] p-2"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {(selectedCategory || selectedSubcategory) && (
          <div className="mb-10">
            <div className="inline-block  text-gray-800 text-sm font-medium py-2 px-4 rounded-md border">
              {`${selectedCategory}${selectedSubcategory ? `: ${selectedSubcategory}` : ''}`}
              <button
                className="ml-2 text-gray-600  hover:text-gray-800"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  onFilterChange("");
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProjects;