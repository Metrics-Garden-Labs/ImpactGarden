'use client';

//thinking about making this a server component that gets the attestation count when you visit and
//doenst update until you refresh the page when you make a contribution.
//otherwise its too much hassle to make it a client component and have it update in real time.
//TODO: make this a server component

import { Fragment, SetStateAction, useState, Dispatch, useEffect } from 'react';
import { LuArrowUpRight } from "react-icons/lu";
import { Project } from '../../src/types';
import Image from 'next/image';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import {useGlobalState} from '@/src/config/config';
import Link from 'next/link';
import { BsGlobe2 } from 'react-icons/bs';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}


interface Props {
  project: Project;
}

export default function Sidebar({ project }: Props) {
  const categories = ['Onchain Builders', 'OP Stack', 'Governance', 'Dev Tooling'];
  const [ attestationCount, setAttestationCount ] = useState(0);
  const [selectedProject, setSelectedProject] = useGlobalState('selectedProject');

 

  useEffect(() => {
    const fetchAttestationCount = async () => {
      if (!project) return;
      try {
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectAttestationCount`, {
          method: 'POST',
          body: JSON.stringify({ project: selectedProject?.projectName }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          const count = data.response.length;
          setAttestationCount(count);
        } else {
          console.error('Failed to fetch attestation count');
        }
      } catch (error) {
        console.error('Failed to fetch attestation count:', error);
      }
    }
    fetchAttestationCount();
  } , [selectedProject]);

  const websiteurl = project?.websiteUrl;
  console.log('Selected website:', websiteurl);

  const getProjectDuration = (createdAt: Date | null | undefined) => {
    if (!createdAt) return 'Unknown';

    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMonths = (currentDate.getFullYear() - createdDate.getFullYear()) * 12 +
      (currentDate.getMonth() - createdDate.getMonth());

    return `${diffInMonths} months`;
  };

  const urlHelper = (url: string) => {
    // Return null if the input URL is empty or just spaces
    if (!url.trim()) {
      return null;
    }
  
    // Ensure the URL starts with http:// or https://
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
  
    return url;
  };

  const checkwebsiteUrl = urlHelper(project?.websiteUrl || '');
  console.log('Selected website:', websiteurl);
  const checktwitterUrl = urlHelper(project?.twitterUrl || '');
  const checkgithubUrl = urlHelper(project?.githubUrl || '');
    

  return (
    <>
      <div className='lg:block lg:w-72 bg-white h-screen pt-16 pb-8'>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar content */}
          <div className="py-10 px-8 flex grow flex-col gap-y-5 bg-white overflow-y-auto px-6 pb-4">
            {/* Company image placeholder */}
            <div className="h-60 bg-gray-300 rounded-lg flex justify-center items-center">
              {/* Replace src with your image path */}
              {project.logoUrl ? (
                    <Image
                      src={project.logoUrl}
                      alt="Project Logo"
                      width={12}
                      height={12}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="mx-auto w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center">
                    </div>
                  )}
            </div>
            {/* Project Name */}
            <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
            {/* Project Link */}
            {/* {project.websiteUrl && (
              <Link href={`${checkwebsiteUrl}`}>
                <p className="text-gray-500 hover:text-gray-300 visited:text-indigo-600 flex items-center">
                {project.websiteUrl}
                <LuArrowUpRight className="ml-1" />
                </p>
              </Link>
            )} */}
            <div className="flex justify-center py-4 items-center">
              <Link href={checkwebsiteUrl || '#'}>
                <BsGlobe2 className="text-black mx-2 text-lg" />
              </Link>
              <Link href={checktwitterUrl || '#'}>
              <FaXTwitter className="text-black mx-2 text-lg" />
              </Link>
              <Link href={checkgithubUrl || '#'}>
                <FaGithub className="text-black mx-2 text-lg" />
              </Link>
            </div>
            {/* Stats and Categories */}
            <div>
              <div className="text-sm font-medium text-gray-500">Attestations: {attestationCount}</div>
              <div className="text-sm font-medium text-gray-500">Length: {getProjectDuration(project.createdAt)}</div>
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