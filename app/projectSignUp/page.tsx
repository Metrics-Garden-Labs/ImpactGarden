// app/projectSignUp/page.tsx
"use client";

import { AttestationNetworkType, networkContractAddresses } from '../components/networkContractAddresses';
import { useEAS } from '../../src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import React, { FormEvent, useState } from 'react';
import { useGlobalState } from '../../src/config/config';
import { redirect } from 'next/navigation';
import { UploadDropzone } from '../../src/utils/uploadthing';
import Navbar from '../components/navbar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NEXT_PUBLIC_URL } from '../../src/config/config';
import { ethers } from 'ethers';
import Image from 'next/image';
import Footer from '../components/footer';
import Link from 'next/link';
import FarcasterLogin from '../components/farcasterLogin';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { BsGlobe2 } from "react-icons/bs";

type AttestationData = {
  projectName: string;
  websiteUrl: string;
  twitterUrl: string;
  githubURL: string;
};

const networks: AttestationNetworkType[] = [
  'Ethereum', 'Optimism', 'Base', 'Arbitrum One', 'Arbitrum Nova', 'Polygon',
  'Scroll', 'Celo', 'Blast', 'Linea', 'Sepolia', 'Optimism Sepolia', 'Optimism Goerli',
  'Base Sepolia', 'Base Goerli', 'Arbitrum Goerli'
];

export default function ProjectSignUp() {


  const [attestationData, setAttestationData] = useState<AttestationData>({
    projectName: '',
    websiteUrl: '',
    twitterUrl: '',
    githubURL: '',
  });
  console.log('Attestation Data:', attestationData);

  const [walletAddress] = useGlobalState('walletAddress');
  const [ user, setUser, removeUser ] = useLocalStorage('user', {
    fid: '',
    username: '',
    ethAddress: '',
  });
  const [captcha, setCaptcha] = useState<string | null>("");
  const [fid] = useGlobalState('fid');
  const [ethAddress] = useGlobalState('ethAddress');
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<string>('Optimism');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  console.log('Ecosystem', ecosystem);
  console.log('walletAddress', walletAddress);
  console.log('Fid', fid);
  console.log('ethAddress', ethAddress);
  const { eas, currentAddress, selectedNetwork, handleNetworkChange } = useEAS();

  const handleNetworkChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as AttestationNetworkType;
    handleNetworkChange(selectedValue);
    console.log('Selected Network', selectedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEcosystemChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEcosystem = e.target.value as AttestationNetworkType;
    setEcosystem(selectedEcosystem);
    console.log('Selected Ecosystem', selectedEcosystem);
  };

  const handleAttestationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    // Ensure required fields are filled before allowing a preview
    if (!attestationData.projectName || !ecosystem) {
      alert('Please fill in required fields.');
      return;
    }
    setIsPreview(true);
  };

  const handleBackToEdit = () => setIsPreview(false);

    //Captcha logic
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Captcha value:", captcha);
    if (captcha) {
      console.log("Captcha is valid");
    }
  };

  const createAttestation = async () => {

    //check for captcha being solved
    if (!captcha) {
        alert("Please complete the captcha to continue");
        return;//exit function if captcha not solved
    }

    if (!user.fid) {
      alert('User not logged in');
      return;
    }

    if (!eas || !currentAddress) {
      console.error('EAS or currentAddress not available');
      return;
    }
    console.log('current address', currentAddress);

    try {
      setIsLoading(true);
      const mainSchemaUid = '0x45ea2d603b7dfcec03e1e4a5d65a22216e5f7a3c3bf1e61560c58c888f2c7f3f';
      const schemaEncoder = new SchemaEncoder('string projectName, string websiteUrl, string twitterUrl, string githubURL, bool MGL');
      console.log('Schema Encoder:', schemaEncoder);
      const encodedData = schemaEncoder.encodeData([
        { name: 'projectName', value: attestationData.projectName, type: 'string' },
        { name: 'websiteUrl', value: attestationData.websiteUrl, type: 'string' },
        { name: 'twitterUrl', value: attestationData.twitterUrl, type: 'string' },
        { name: 'githubURL', value: attestationData.githubURL, type: 'string' },
        { name: 'MGL', value: true, type: 'bool' }
      ]);
      console.log('Encoded Data:', encodedData);

      console.log('user', user);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Provider:', provider);
      const signer = await provider.getSigner();
      console.log('Signer:', signer);
      eas.connect(signer);
      const delegatedSigner = await eas.getDelegated();
      console.log('Delegated Signer:', delegatedSigner);

      const easnonce = await eas.getNonce(walletAddress);
      console.log('EAS Nonce:', easnonce);

      const attestation: EIP712AttestationParams = {
        schema: mainSchemaUid,
        recipient: currentAddress,
        expirationTime: BigInt(9973891048),
        revocable: true,
        refUID: '0xf346439091b62e1b0156fd9e86f73c4662007e751184173b61326ad53fb60f5f',
        data: encodedData,
        value: BigInt(0),
        deadline: BigInt(9973891048),
        nonce: easnonce,
      };
      console.log('Attestation:', attestation);

      try {
        const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);
        console.log('Sign Delegated:', signDelegated);

        attestation.data = encodedData;
        const signature = signDelegated.signature;

        const dataToSend = {
          ...attestation,
          signature: signature,
          attester: walletAddress,
        };

        const serialisedData = JSON.stringify(dataToSend, (key, value) =>
          typeof value === 'bigint' ? "0x" + value.toString(16) : value
        );
        console.log('Serialised Data:', serialisedData);

        const response = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: serialisedData,
        });
        const responseData = await response.json();
        console.log('Response Data:', responseData);

        if (responseData.success) {
          setAttestationUID(responseData.attestationUID);
          console.log('Attestations created successfully');
        
          const projectUid = responseData.attestationUID;
          console.log('Project UID:', projectUid);
        
          const newProject = {
            //userFid: fid,
            userFid: user.fid,
            ethAddress: currentAddress,
            projectName: attestationData.projectName,
            websiteUrl: attestationData.websiteUrl,
            twitterUrl: attestationData.twitterUrl,
            githubUrl: attestationData.githubURL,
            ecosystem: ecosystem,
            projectUid: projectUid,
            logoUrl: imageUrl,
          };
        
          const response1 = await fetch(`${NEXT_PUBLIC_URL}/api/addProjectDb`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject)
          });
          const dbResponse = await response1.json();
          console.log('insert project to db success', dbResponse);
        }
      } catch (error) {
        console.error('Failed to create attestations:', error);
        alert('An error occurred while creating attestations. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create attestations:', error);
      alert('An error occurred while creating attestations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderModal = () => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center rounded justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Image  
              src="/MGLIcon.png"
              alt="Loading"
              width={100}
              height={100}
              className='justify-center mx-auto object-contain mt-6 mb-6'
            />
            <h2 className="text-xl font-bold mb-4 justify-center text-center mt-6 mb-6">Processing Attestation</h2>
            <div className="flex items-center">
              <p>Please wait while your attestation is being processed...</p>
            </div>
            <div className="flex justify-center items-center mb-6 mt-6">
              <p className="loading loading-spinner loading-lg text-center"></p>
            </div>
          </div>
        </div>
      );
    } 
    return null;
  };

  if(attestationUID) {
      return (
        <div className="min-h-screen flex flex-col bg-white text-black">
          <Navbar />
          <ConfirmationSection
            attestationUID={attestationUID}
            attestationData={attestationData}
            imageUrl={imageUrl}
          />
          <Footer />
        </div>
      );
    }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      
      <div className="flex justify-center relative w-full mt-10 px-8">
        <TopRightLogin user={user} />
        {/* Left Column */}
        { isPreview ? (

        <div className="w-1/4 pr-8">
          <h1 className="font-bold text-2xl">Register a project</h1>
          <p className="text-gray-600 mt-2">Project preview & confirmation</p>
        </div>
        ) : (
          <div className="w-1/4 pr-8 flex flex-col items-center">
               <div>
                 <h1 className="font-bold text-2xl text-center">Register a project</h1>
                 <p className="text-gray-600 mt-2 text-center">Tell us more about your project</p>
                 <h2 className="font-semibold mt-10 pb-10 text-center text-lg">Project card preview</h2>
          
                 <div className="shadow-2xl rounded mx-auto mt-6">
                   <div className="pt-6 pb-6">
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
                     <div className="flex justify-center py-4 items-center">
                       <BsGlobe2 className="text-black mx-2 text-lg" />
                       <FaXTwitter className="text-black mx-2 text-lg" />
                       <FaGithub className="text-black mx-2 text-lg" />
                     </div>
                   </div>
                 </div>
               </div>
               </div>
        )}

        {/* Center Column */}
        {isPreview ? (
          <div className="w-2/3 bg-white p-8 shadow-lg rounded mx-auto">
          <h2 className="font-semibold mt-6 text-center text-lg">Project card preview</h2>
          <div className="shadow-2xl rounded mx-auto mt-6 pt-8 pb-8 w-1/2 flex flex-col items-center">
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
            <h3 className="text-center mt-6 mb-6 font-semibold text-gray-500">
              {attestationData.projectName || 'Project name'}
            </h3>
            <div className="flex justify-center py-4 items-center">
              <BsGlobe2 className="text-black mx-2 text-lg" />
              <FaXTwitter className="text-black mx-2 text-lg" />
              <FaGithub className="text-black mx-2 text-lg" />
            </div>
          </div>

          <div className="mt-20 mb-20  flex justify-center w-full">
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
          </div>

          <div className="flex justify-center space-x-6 mt-20 mb-20">
            <button
              className="px-4 py-2 w-1/5 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
              onClick={createAttestation}
            >
              Confirm & Attest
            </button>
            <button
              className="px-4 py-2 w-1/5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
              onClick={handleBackToEdit}
            >
              Back to Edit
            </button>
          </div>
        </div>
        
        ) : (
          <form className="w-1/3 bg-white p-6 shadow rounded space-y-6">
        <div>
          <label htmlFor="attestationChain" className="block text-sm font-medium leading-6 text-gray-900">
            Select Attestation Network *
          </label>
          <div className="mt-2">
            <select
              id="attestationChain"
              name="attestationChain"
              value={selectedNetwork}
              onChange={handleNetworkChangeEvent}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {Object.keys(networkContractAddresses).map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
        </div>

          <div>
          <label htmlFor="ecosystem" className="block text-sm font-medium leading-6 text-gray-900">
            What ecosystem is your project contributing to? *
          </label>
          <div className="mt-2">
            <select
              id="ecosystem"
              name="ecosystem"
              value={ecosystem}
              onChange={handleEcosystemChangeEvent}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {networks.map((network) => (
                <option key={network} value={network}>
                  {network} Ecosystem
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
              onChange={handleAttestationChange}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type Project Name here"
            />
          </div>
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium leading-6 text-gray-900">
              <span>What is the website URL of your project? </span>
              <span className="text-gray-500 text-sm">(Optional)</span>
              
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="websiteUrl"
              name="websiteUrl"
              value={attestationData.websiteUrl}
              onChange={handleAttestationChange}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type the website URL here"
            />
          </div>
        </div>

        <div>
          <label htmlFor="twitterUrl" className="block text-sm font-medium leading-6 text-gray-900">
            <span>What is the Twitter URL of your project? </span>
            <span className="text-gray-500 text-sm">(Optional)</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="twitterUrl"
              name="twitterUrl"
              value={attestationData.twitterUrl}
              onChange={handleAttestationChange}
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
              onChange={handleAttestationChange}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type the Github URL here"
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
              console.log(setImageUrl);
              alert("Upload Completed");
            }}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        )}

          {/* <div className='flex justify-center items-center py-2'>
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
          </div> */}
          {/* <div className="flex justify-center items-center py-2">
            <button className="btn items-center" type="button" onClick={createAttestation}>
              Get your Attestation
            </button> 
          </div> */}
          <div className="mt-6 flex justify-end justify-center space-x-4">
            <button
              className="px-4 py-2 w-1/5 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
              onClick={handleNext}
            >
              Next
            </button>
            <button className="px-4 py-2 w-1/5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="button">
              Cancel
            </button>
          
          </div>
        </form>
        )}

        {/* Right Column: Empty */}
        <div className="w-1/4">
        </div>
      </div>
      <ConfirmationSection
        attestationUID={attestationUID}
        attestationData={attestationData}
        imageUrl={imageUrl}
      />
      <Footer />
      {renderModal()}
    </div>
  );
}

interface ConfirmationSectionProps {
  attestationUID: string;
  attestationData: AttestationData;
  imageUrl: string;
}

// ConfirmationSection Component Implementation
const ConfirmationSection: React.FC<ConfirmationSectionProps> = ({
  attestationUID,
  attestationData,
  imageUrl,
}) => {
  if (!attestationUID) {
    return null; // If no attestationUID, don't show this section
  }

  return (
    <div className="w-full bg-white p-8 shadow-lg flex flex-col items-center mx-auto my-10 rounded-lg">
      <Image
        src="/star.png"
        alt="Attestation Created"
        width={100}
        height={100}
        className="object-contain mb-10 mt-10"
      />
      <h2 className="text-4xl font-bold mb-10">Attestation Created</h2>
      <p className="text-lg mb-10">Your project has been successfully created.</p>
      <div className="w-1/3 flex flex-col items-center shadow-2xl rounded p-8 mb-8">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Project Logo"
            width={400}
            height={400}
            className="object-contain mt-15"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center">
            {/* Optional placeholder content */}
          </div>
        )}
        <h3 className="text-center mt-6 mb-6 font-semibold text-gray-500 text-2xl">
          {attestationData.projectName || 'Project Name'}
        </h3>
        <div className="flex justify-center py-4 items-center">
          <BsGlobe2 className="text-black mx-2 text-2xl" />
          <FaXTwitter className="text-black mx-2 text-2xl" />
          <FaGithub className="text-black mx-2 text-2xl" />
        </div>
      </div>
      <p className="text-lg mt-8">Attestation UID:</p>
      <p className="text-lg p-2 underline">{attestationUID}</p>

      {/* comment this back in when i have the eas scan link for each project
      <Link href={`/projects/${attestationUID}`} passHref>
        <p className="text-lg p-2 underline">{attestationUID}</p>
      </Link> */}
      <Link href={`/projects/${attestationData.projectName}`} passHref className="pt-6">
        <button className="mt-4 px-6 py-3 bg-black text-white rounded-md text-lg">
          Visit your Project
        </button>
      </Link>
    </div>
  );
};

interface TopRightLoginProps {
  user: {
    fid: string;
    username: string;
    ethAddress: string;
  };
}

const TopRightLogin: React.FC<TopRightLoginProps> = ({ user }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      {user.fid ? (
        <ConnectButton />
      ) : (
        <FarcasterLogin />
      )}
    </div>
  );
};