'use client';
import { Fragment, SetStateAction, useState, Dispatch } from 'react';
import { LuArrowUpRight } from "react-icons/lu";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  isOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ isOpen, setSidebarOpen }: Props) {
  const categories = ['Onchain Builders', 'OP Stack', 'Governance', 'Dev Tooling'];

  return (
    <>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block lg:w-72 bg-white h-screen pt-16 pb-8`}>
        <div className="flex flex-col h-full overflow-y-auto">
         
            {/* Sidebar content */}
            <div className="py-10 px-8 flex grow flex-col gap-y-5 bg-white overflow-y-auto px-6 pb-4">
              {/* Company image placeholder */}
              <div className="h-60 bg-gray-300 rounded-lg flex justify-center items-center">
                {/* Replace src with your image path */}
                <img src="/MGLIcon.png" alt="Company Logo" className="h-full w-full object-cover rounded-lg"/>
              </div>
              {/* Project Name */}
              <h2 className="text-2xl font-bold text-gray-900">Ephema</h2>
              {/* Project Link */}
              <a href="https://ephema.org" className="text-gray-500 hover:text-gray-300 visited:text-indigo-600 flex items-center">
                Ephema.org
                <LuArrowUpRight className='ml-1' />
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
            </div>
          </div>
        </div>
    
      {/* additional rendering for smaller screens */}
    </>
  );
}