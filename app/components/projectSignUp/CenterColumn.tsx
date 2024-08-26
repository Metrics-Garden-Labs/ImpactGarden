import React from 'react';
import Image from 'next/image';
import { UploadDropzone } from '../../../src/utils/uploadthing';
import ReCAPTCHA from 'react-google-recaptcha';
import { AttestationData, AttestationNetworkType } from '@/src/types';
import { networks } from '@/src/utils/projectSignUpUtils';
import Link from 'next/link';
import { BsGlobe2 } from "react-icons/bs";
import { FaXTwitter, FaGithub } from "react-icons/fa6";

interface CenterColumnProps {
  isPreview: boolean;
  attestationData: AttestationData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNetworkChangeEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSecondaryEcosystemChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedNetwork: AttestationNetworkType;
  secondaryEcosystem: string;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  handleNext: () => void;
  handleBackToEdit: () => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  setCaptcha: (value: string | null) => void;
}

const CenterColumn: React.FC<CenterColumnProps> = ({
  isPreview,
  attestationData,
  handleInputChange,
  handleNetworkChangeEvent,
  handleSecondaryEcosystemChange,
  selectedNetwork,
  secondaryEcosystem,
  imageUrl,
  setImageUrl,
  handleNext,
  handleBackToEdit,
  onSubmit,
  setCaptcha,
}) => {
  const urlHelper = (url: string) => {
    if (!url.trim()) return null;
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
  };

  const checkwebsiteUrl = urlHelper(attestationData?.websiteUrl || '');
  const checktwitterUrl = urlHelper(attestationData?.twitterUrl || '');
  const checkgithubUrl = urlHelper(attestationData?.githubURL || '');

  if (isPreview) {
    return (
      <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-8 shadow-lg rounded mx-auto">
        <h2 className="font-semibold mt-6 text-center text-lg md:hidden lg:hidden">Project card preview</h2>
        <div className="shadow-2xl rounded mx-auto mt-6 pt-8 pb-8 flex flex-col items-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Project Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center">
              {/* Add optional placeholder content if needed */}
            </div>
          )}
          <h3 className="text-center mt-6 mb-2 font-semibold text-gray-500">
            {attestationData.projectName || 'Project name'}
          </h3>
          <p className='text-center mt-2 mb-2 text-gray-400'>
            {attestationData.oneliner || 'Project description'}
          </p>
          <div className="flex justify-center py-4 items-center">
            <Link href={checkwebsiteUrl || '#'}>
              <BsGlobe2 className="text-black mx-2 text-lg hover:text-[#2C3F2D]" />
            </Link>
            <Link href={checktwitterUrl || '#'}>
              <FaXTwitter className="text-black mx-2 text-lg hover:text-[#2C3F2D]" />
            </Link>
            <Link href={checkgithubUrl || '#'}>
              <FaGithub className="text-black mx-2 text-lg hover:text-[#2C3F2D]" />
            </Link>
          </div>
        </div>

        <div className="mt-20 mb-20 flex justify-center w-full">
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
        </div>

        <div className="flex justify-center space-x-4 mt-20 mb-20">
          <button
            className="px-4 py-2 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 text-xs sm:text-sm font-medium text-white bg-black rounded-md shadow-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={onSubmit}
          >
            Confirm & Attest
          </button>
          <button
            className="px-4 py-2 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={handleBackToEdit}
          >
            Back to Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="w-full md:w-1/2 lg:w-1/3 bg-white p-6 shadow rounded space-y-6">
      <div>
        <label htmlFor="attestationChain" className="block text-sm font-medium leading-6 text-gray-900">
          Ecosystem and Network of Contribution * (Only Optimism is supported at the moment)
        </label>
        <div className="mt-2">
          <select
            id="attestationChain"
            name="attestationChain"
            value={selectedNetwork}
            onChange={handleNetworkChangeEvent}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="secondaryEcosystem" className="block text-sm font-medium leading-6 text-gray-900">
          What is the Secondary Ecosystem of your project? * (Optional) 
        </label>
        <div className="mt-2">
          <select
            id="secondaryEcosystem"
            name="secondaryEcosystem"
            value={secondaryEcosystem}
            onChange={handleSecondaryEcosystemChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option>Choose Option</option>
            {networks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="projectName" className="block text-sm font-medium leading-6 text-gray-900">
          What is the name of your project? *
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={attestationData.projectName}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type Project Name here"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="oneliner" className="block text-sm font-medium leading-6 text-gray-900">
          A brief one line description of your project *
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="oneliner"
            name="oneliner"
            value={attestationData.oneliner}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type Project Description Here"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium leading-6 text-gray-900">
          Website URL  *
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={attestationData.websiteUrl}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type the website URL here"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="twitterUrl" className="block text-sm font-medium leading-6 text-gray-900">
          <span>Twitter </span>
          <span className="text-gray-500 text-sm">(Optional)</span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="twitterUrl"
            name="twitterUrl"
            value={attestationData.twitterUrl}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type the Twitter URL here"
          />
        </div>
      </div>

      <div>
        <label htmlFor="githubURL" className="block text-sm font-medium leading-6 text-gray-900">
          <span>What is the Github URL of your project? </span>
          <span className="text-gray-500 text-sm">(Optional)</span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="githubURL"
            name="githubURL"
            value={attestationData.githubURL}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type the Github URL here"
          />
        </div>
      </div>

      <div>
        <label htmlFor="farcaster" className="block text-sm font-medium leading-6 text-gray-900">
          Farcaster *
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="farcaster"
            name="farcaster"
            value={attestationData.farcaster}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type Farcaster here"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="mirror" className="block text-sm font-medium leading-6 text-gray-900">
          Mirror
          <span className="text-gray-500 text-sm"> (Optional)</span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="mirror"
            name="mirror"
            value={attestationData.mirror}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Type Mirror Channel ID here"
          />
        </div>
      </div>

      <h2>Please upload the logo of your project *</h2>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Logo of the project"
          width={1000}
          height={667}
          className="w-full h-64 object-contain"
        />
      ) : (
        <UploadDropzone
          className="border-black bg-slate-300 w-full h-64 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setImageUrl(res[0].url);
            console.log("Files: ", res);
            console.log("Uploaded Image URL:", res[0].url);
            alert("Upload Completed");
          }}
          onUploadError={(error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      )}

      <div className="mt-6 flex justify-end justify-center space-x-4">
        <button
          className="px-4 py-2 w-1/5 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="button"
          onClick={handleNext}
        >
          Next
        </button>
        <button className="px-4 py-2 w-1/5 text-sm font-medium text-gray-700 underline bg-white border-none  " type="button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CenterColumn;