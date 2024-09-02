'use client';
import React from 'react';
import { Project } from '../../src/types';
import Image from 'next/image';
import Link from 'next/link';
import { BsGlobe2 } from 'react-icons/bs';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

interface Props {
  project: Project;
  projectAttestationCount: number;
  categories: string[];
  subcategories: string[];
}

const Sidebar: React.FC<Props> = ({ project, projectAttestationCount, categories, subcategories }) => {
  const websiteurl = project?.websiteUrl;


  const getProjectDuration = (createdAt: Date | null | undefined) => {
    if (!createdAt) return 'Unknown';

    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMonths = (currentDate.getFullYear() - createdDate.getFullYear()) * 12 +
      (currentDate.getMonth() - createdDate.getMonth());

    return `${diffInMonths} months`;
  };

  const urlHelper = (url: string) => {
    if (!url.trim()) {
      return null;
    }
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  const checkwebsiteUrl = urlHelper(project?.websiteUrl || '');
  const checktwitterUrl = urlHelper(project?.twitterUrl || '');
  const checkgithubUrl = urlHelper(project?.githubUrl || '');

  return (
    <div className='block w-72 bg-white h-screen pt-16 pb-8'>
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="py-10 px-8 flex grow flex-col gap-y-5 bg-white overflow-y-auto px-6 pb-4">
          <div className="h-60 bg-gray-300 rounded-full flex justify-center items-center">
            {project.logoUrl ? (
              <Image
                src={project.logoUrl}
                alt="Project Logo"
                width={12}
                height={12}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <div className="mx-auto w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
          {checkwebsiteUrl && (
              <div className="">
                <Link href={checkwebsiteUrl || '#'}>
                  <p className='flex items-center '>
                  <BsGlobe2 className="text-black mx-2 text-lg" />
                  <span>Website</span>
                  </p>
                </Link>
                </div>
            )}
            
            {checktwitterUrl && (
              <div>
                <Link href={checktwitterUrl || '#'}>
                  <p className='flex items-center'>
                  <FaXTwitter className="text-black mx-2 text-lg" />
                  <span>Twitter</span>
                  </p>
                </Link>
              </div>
            )}


            {checkgithubUrl && (
              <div>
                <Link href={checkgithubUrl || '#'}>
                  <p className='flex items-center'>
                    <FaGithub className="text-black mx-2 text-lg" />
                    <span>Github</span>
                  </p>
                </Link>
              </div>
            )}
          <div>
            <div className="text-sm font-medium text-gray-500">Attestations: {projectAttestationCount}</div>
            <div className="text-sm font-medium text-gray-500">Created {getProjectDuration(project.createdAt)} <span>ago</span></div>
            
            {/* Categories */}
            <div className="text-sm py-2 font-medium text-gray-500">Categories:</div> 
            <div className='mt-4'>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category} className='mb-2'>
                    <span className="inline-block bg-gray-100 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {category}
                    </span>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>

            {/* Subcategories */}
            <div className="text-sm py-2 font-medium text-gray-500">Subcategories:</div> 
            <div className='mt-4'>
              {subcategories && subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <div key={subcategory} className='mb-2'>
                    <span className="inline-block bg-gray-200 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {subcategory}
                    </span>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;