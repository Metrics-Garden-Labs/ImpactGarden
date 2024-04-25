//this will be the project page from the lofi

//split into two parts

//there will be a sidebar that contains the project information

//there will be a main section that contains the header bar and the project information 
'use client'

import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('attestations');
  const [searchTerm, setSearchTerm] = useState('');

  const tabClasses = (tabName:string) =>
  `cursor-pointer px-4 py-2 text-sm font-semibold  mr-2 ${
    activeTab === tabName
      ? 'border-b-2 border-black'
      : 'text-gray-600 hover:text-black'
  }`;

  const contributions = [
    { id: 1, title: 'Contribution #1', content: 'Enter some content here...' },
    { id: 2, title: 'Contribution #2', content: 'Enter some content here...' },
    { id: 3, title: 'Contribution #3', content: 'Enter some content here...' },
    { id: 4, title: 'Contribution #4', content: 'Enter some content here...' },
    { id: 5, title: 'Contribution #5', content: 'Enter some content here...' },
    { id: 6, title: 'Contribution #6', content: 'Enter some content here...' },
    { id: 7, title: 'Contribution #7', content: 'Enter some content here...' },
  ];

  const filteredContributions = contributions.filter((contribution) =>
  contribution.title.toLowerCase().includes(searchTerm.toLowerCase())
);

  const renderContent = () => {
    switch (activeTab) {
      case 'attestations':
        return (
            <div className="p-6 bg-backgroundgray">
                <div className="mb-4 flex justify-end">
                    <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 bg-backgroundgray text-black rounded-full w-60 border-none focus:ring-0 focus:border-none">
                        <option>Sort by: Most Attestations</option>
                        {/* ...other sorting options */}
                    </select>
                    <div className="relative w-80">
                        <input
                        type="text"
                        placeholder="Search for a contribution..."
                        className="px-4 py-2 border border-gray-300 rounded-full w-full"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-3 top-3 text-black">
                        <FaSearch />
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="grid grid-cols-3 gap-12">
                        {filteredContributions.map((contribution) => (
                        <div key={contribution.id} className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-xl w-full h-60 shadow-lg">
                            <h3 className="mb-2 text-xl font-semibold ">{contribution.title}</h3>
                            <p className='text-gray-500'>{contribution.content}</p>
                        </div>
                    ))}
                </div>
            </div>
          );
      case 'insights':
        return <div className='text-black'>Content for Insights</div>;
      case 'charts':
        return <div className='text-black'>Content for Charts</div>;
      default:
        return <div className='text-black'>Select a tab</div>;
    }
  };

  return (
    <main className="flex-grow p-10 bg-backgroundgray w-fulll h-full">
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4 text-black">
          <button onClick={() => setActiveTab('attestations')} className={tabClasses('attestations')}>
            Contributions
          </button>
          <button onClick={() => setActiveTab('insights')} className={tabClasses('insights')}>
            Insights
          </button>
          <button onClick={() => setActiveTab('charts')} className={tabClasses('charts')}>
            Charts
          </button>
        </nav>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </main>
  );
}