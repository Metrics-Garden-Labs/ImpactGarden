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
  isLoading: boolean;
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
  isLoading,
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

        <p className='text-center text-sm text-gray-500 mb-2'> Clicking "Confirm & Attest" will create 2 attestations. Please wait for the first attestation to complete. You will then be prompted to sign a second attestation.</p>

        <div className="flex justify-center space-x-4 mt-20 mb-20">
          <button
            className="px-4 py-2 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 text-xs sm:text-sm font-medium text-white bg-black rounded-md shadow-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Confirm & Attest
          </button>
          <button
            className="px-4 py-2 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={handleBackToEdit}
            disabled={isLoading}
          >
            Back to Edit
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="w-full md:w-1/2 lg:w-1/3 relative">
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200" style={{ left: '-30px' }}></div>
        <form className="bg-white p-6 space-y-6">
          <div>
            <label htmlFor="attestationChain" className="block text-sm font-medium leading-6 text-gray-900">
              Attestation Network <span className="text-[#24583C] text-sm">*</span>
            </label>
            <div className="mt-2">
              <select
                id="attestationChain"
                name="attestationChain"
                value={selectedNetwork}
                onChange={handleNetworkChangeEvent}
                required
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>Optimism</option>
                {/* {networks.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))} */}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="secondaryEcosystem" className="block text-sm font-medium leading-6 text-gray-900">
              What is the Secondary Ecosystem of your project? <span className='text-xs text-[#D1D5DB]'> (optional) </span>
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
              Name of your project? <span className="text-[#24583C] text-sm">*</span>
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
              Description of your project <span className="text-[#24583C] text-sm">*</span>
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
              Website URL of your project <span className="text-[#24583C] text-sm">*</span>
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
              <span>X (Twitter) account of your project </span>
              <span className='text-xs text-[#D1D5DB]'> (optional) </span>
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
              <span className='text-xs text-[#D1D5DB]'> (optional) </span>
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
              Farcaster of your project <span className="text-[#24583C] text-sm">*</span>
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
              Mirror of your project
              <span className='text-xs text-[#D1D5DB]'> (optional) </span>
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

          <h2>Upload logo of your project <span className="text-[#24583C] text-sm">*</span></h2>
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
              className="border-slate-300 border-solid bg-white w-full h-64 ut-label:text-lg ut-label:text-black ut-button:bg-[#353436] ut-allowed-content:ut-uploading:text-red-300"
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
          className="btn text-sm  items-center font-medium text-white bg-black rounded-md shadow-sm hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  </div>
  );
};

export default CenterColumn;