// LeftColumn.tsx
import React from 'react';
import Image from 'next/image';
import { BsGlobe2 } from "react-icons/bs";
import { FaXTwitter, FaGithub } from "react-icons/fa6";
import { AttestationData } from '@/src/types';

interface LeftColumnProps {
  isPreview: boolean;
  imageUrl: string;
  attestationData: AttestationData;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ isPreview, imageUrl, attestationData }) => {
  if (isPreview) {
    return (
      <div className="hidden md:block md:w-1/2 lg:w-1/3 pr-0 md:pr-8 mb-8 md:mb-0">
        <h1 className="font-bold text-2xl">Register a project</h1>
        <p className="text-gray-600 mt-2">Project preview & confirmation</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block md:w-1/2 lg:w-1/3 pr-8">
      <div className="sticky top-0">
        <h1 className="font-bold text-2xl">Register a project</h1>
        <p className="text-gray-600 mt-2 mb-10">Tell us more about your project</p>
        <h2 className="font-semibold text-center mt-10 pb-4 text-lg">Project card preview</h2>

        <div className='w-full'>
          <div className="shadow-2xl rounded mx-auto w-2/3 md:max-w-1/3 lg:max-w-1/6 ">
            <div className="pt-6 pb-6 ">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Project Logo"
                  width={100}
                  height={100}
                  className="mx-auto object-contain"
                />
              ) : (
                <div className="mx-auto w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center">
                </div>
              )}
              <h3 className="text-center mt-2 font-semibold text-gray-500">
                {attestationData.projectName || 'Project name'}
              </h3>
              <p className='text-center mt-2 text-gray-400'>
                {attestationData.oneliner || 'Project description'}
              </p>
              <div className="flex justify-center py-4 items-center">
                <BsGlobe2 className="text-black mx-2 text-lg" />
                <FaXTwitter className="text-black mx-2 text-lg" />
                <FaGithub className="text-black mx-2 text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;