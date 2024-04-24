
'use client';
import { Fragment, useState } from 'react';
import { LuArrowUpRight } from "react-icons/lu";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = ['Onchain Builders', 'OP Stack', 'Governance', 'Dev Tooling'];

  return (
    <>
      <div className="hidden lg:flex lg:w-72 lg:flex-col bg-white">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="py-10 px-8 flex grow flex-col gap-y-5 bg-white overflow-y-auto px-6 pb-4">
          {/* Company image placeholder */}
          <div className="h-60 bg-gray-300 rounded-lg flex justify-center items-center">
            {/* Replace src with your image path */}
            <img src="/path-to-company-image.png" alt="Company Logo" className="h-full w-full object-cover rounded-lg"/>
          </div>
          
          {/* Project Name */}
          <h2 className="text-2xl font-bold text-gray-900">Ephema</h2>

          {/* Project Link */}
          <a href="https://ephema.org" className="text-gray-500 hover:text-gray-300 visited:text-indigo-600 flex items-center">
            Ephema.org <LuArrowUpRight className='ml-1' />
          </a>

          {/* Stats and Categories */}
          <div>
            <div className="text-sm font-medium text-gray-500">Attester: 85</div>
            <div className="text-sm font-medium text-gray-500">Length: 2 months</div>
            <div className="text-sm py-2 font-medium text-gray-500">Categories:</div>
            
            {/* Categories */}
            <div className='mt-4'>
                {categories.map((category) => (
                <div key={category} className='mb-2'>
                    <span className="inline-block bg-gray-100 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {category}
                    </span>
                </div>
                ))}
            </div>
          </div>
          {/* Add the rest of your sidebar content here */}
        </div>
      </div>
    </>
  );
}