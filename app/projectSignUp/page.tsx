// app/projectSignUp/page.tsx
"use client";

import {  networkContractAddresses, getChainId } from '../components/networkContractAddresses';
import { useEAS } from '../../src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import React, { FormEvent, useEffect, useState } from 'react';
import { useGlobalState } from '../../src/config/config';
import { UploadDropzone } from '../../src/utils/uploadthing';
import Navbar from '../components/navbar1';
import { NEXT_PUBLIC_URL } from '../../src/config/config';
import { ethers } from 'ethers';
import Image from 'next/image';
import Footer from '../components/footer';
import Link from 'next/link';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { BsGlobe2 } from "react-icons/bs";
import { Project, AttestationNetworkType } from '@/src/types';
import { useSwitchChain } from 'wagmi';
import AttestationCreationModal from '../components/attestationCreationModal';
import ConfirmationSection from './confirmationPage';

type AttestationData = {
  projectName: string;
  oneliner: string | "";
  websiteUrl: string;
  twitterUrl: string;
  githubURL: string;
  farcaster: string;
};

const networks: AttestationNetworkType[] = [
  'Ethereum', 'Optimism', 'Base', 'Arbitrum One', 'Polygon',
  'Scroll', 'Celo', 'Blast', 'Linea'
];

export default function ProjectSignUp() {


  

  const [walletAddress] = useGlobalState('walletAddress');
  const [ user, setUser, removeUser ] = useLocalStorage('user', {
    fid: '',
    username: '',
    ethAddress: '',
  });
  const [attestationData, setAttestationData] = useState<AttestationData>({
    projectName: '',
    oneliner: '',
    websiteUrl: '',
    twitterUrl: '',
    githubURL: '',
    farcaster: user.fid,
  });
  console.log('Attestation Data:', attestationData);

  const [selectedProject, setSelectedProject] = useLocalStorage<Project | null>('selectedProject', null);
  const [captcha, setCaptcha] = useState<string | null>("");
  const [fid] = useGlobalState('fid');
  const [ethAddress] = useGlobalState('ethAddress');
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<string>('Optimism');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();
  
  console.log('Ecosystem', ecosystem);
  console.log('walletAddress', walletAddress);
  console.log('Fid', fid);
  console.log('ethAddress', ethAddress);

  const { eas, currentAddress, selectedNetwork, address, handleNetworkChange } = useEAS();
  console.log('selectedNetwork', networkContractAddresses[selectedNetwork]?.attestAddress);

  useEffect(() => {
    const checkNetwork = async () => {
      if (selectedNetwork) {
        const chainId = getChainId(selectedNetwork);
        if (chainId) {
          try {
            await switchChain({ chainId });
          } catch (error) {
            console.error('Failed to switch network:', error);
            // Show an error message or prompt to the user indicating the need to switch networks
            alert('Please switch to the correct network in your wallet.');
          }
        }
      }
    };
  
    checkNetwork();
  }, [selectedNetwork, switchChain]);

  useEffect(() => {
    if (attestationUID) {
      const project: Project = {
        userFid: user.fid,
        projectName: attestationData.projectName,
        oneliner: attestationData.oneliner,
        websiteUrl: attestationData.websiteUrl,
        twitterUrl: attestationData.twitterUrl,
        githubUrl: attestationData.githubURL,
        logoUrl: imageUrl,
        projectUid: attestationUID,
        ecosystem: ecosystem,
        // Add other relevant properties from the attestationData
      };
      setSelectedProject(project);
    }
  }, [attestationUID, attestationData, imageUrl, user.fid, ecosystem, setSelectedProject]);

  const handleNetworkChangeEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedValue = e.target.value as AttestationNetworkType;
    setEcosystem(selectedValue);
    // Check if the selected network is 'mainnet' and adjust to 'Optimism', this will do for now
    if (selectedValue === 'Ethereum') {
      selectedValue = 'Optimism';
      alert('Mainnet is not supported at the moment, switching to Optimism.');
    }
    handleNetworkChange(selectedValue);
    console.log('Selected Network', selectedValue);
  
    const chainId = getChainId(selectedValue);
    if (chainId) {
      try {
        await switchChain({ chainId });
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({ ...prevData, [name]: value }));
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

  const checkwebsiteUrl = urlHelper(attestationData?.websiteUrl || '');
  console.log('Selected website:', checkwebsiteUrl);
  const checktwitterUrl = urlHelper(attestationData?.twitterUrl || '');
  const checkgithubUrl = urlHelper(attestationData?.githubURL || '');



  //Create attestation logic
  //--------------------------------------------------------------------------------

  const createAttestation = async () => {

    //check for captcha being solved
    if (!captcha) {
        alert("Please complete the captcha to continue");
        return;//exit function if captcha not solved
    }

    if (!user.fid || user.fid === '') {
      alert('User not logged in');
      return;
    }

    if (!eas || !currentAddress) {
      console.error('Please connect your wallet to continue');
      return;
    }
    console.log('current address', currentAddress);
    {/* schema is just for OP at the minute would have to make a schema for each network */}
    try {
      setIsLoading(true);
      const mainSchemaUid = '0x6b4a2e50104d9b69e49c6a19a2054b78c7e87c9c924cba237ebbd5bb0a50a5c4';
      const schemaEncoder = new SchemaEncoder(
          'string Project, string Description, string Website, string Twitter, string Github, string Farcsater'
      );
      console.log('Schema Encoder:', schemaEncoder);
      const encodedData = schemaEncoder.encodeData([
        { name: 'Project', value: attestationData.projectName, type: 'string' },
        { name: 'Description', value: attestationData.oneliner, type: 'string' },
        { name: 'Website', value: attestationData.websiteUrl, type: 'string' },
        { name: 'Twitter', value: attestationData.twitterUrl, type: 'string' },
        { name: 'Github', value: attestationData.githubURL, type: 'string' },
        { name: 'Farcaster', value: user.fid, type: 'string' },
      ]);
      console.log('Encoded Data:', encodedData);

      console.log('user', user);
      const eas1 = new EAS(networkContractAddresses[selectedNetwork]?.attestAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Provider:', provider);
      const signer = await provider.getSigner();
      console.log('Signer:', signer);
      eas1.connect(signer);
      console.log('EAS:', eas1);
      const delegatedSigner = await eas1.getDelegated();
      console.log('Delegated Signer:', delegatedSigner);

      const easnonce = await eas1.getNonce(walletAddress);
      console.log('EAS Nonce:', easnonce);

      const attestation: EIP712AttestationParams = {
        schema: mainSchemaUid,
        recipient: currentAddress,
        expirationTime: BigInt(9973891048),
        revocable: true,
        //refUID: '0xf346439091b62e1b0156fd9e86f73c4662007e751184173b61326ad53fb60f5f',
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
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

        const backendWallet = '0xE27a079BcE042d7163A47eB35D591D241eA7196b';

        const dataToSend = {
          ...attestation,
          signature: signature,
          attester: backendWallet,
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
            oneliner: attestationData.oneliner,
            twitterUrl: attestationData.twitterUrl,
            githubUrl: attestationData.githubURL,
            ecosystem: ecosystem,
            projectUid: projectUid,
            logoUrl: imageUrl,
          };

          //Add project to database
        
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

  
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Captcha value:", captcha);
  
    // First, check if the CAPTCHA has been completed
    if (!captcha) {
      alert("Please complete the CAPTCHA to continue.");
      return;  // Stop the function if there's no CAPTCHA response
    }
  
    // Next, check if the wallet address is connected and is a non-empty string
    if (!address || address.trim() === "") {
      alert("Please connect your wallet to proceed.");
      return;  // Stop the function if there's no wallet address or if it's empty
    }
  
    // If both CAPTCHA and wallet address are valid, proceed to verify the CAPTCHA with the backend
    try {
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/verifyCaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ captchaResponse: captcha }),
      });
  
      if (response.ok) {
        console.log('Captcha is valid and wallet is connected');
        createAttestation();
      } else {
        // If the response is not OK, assume the CAPTCHA was invalid
        console.error('Captcha is invalid');
        alert('Captcha is invalid. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify captcha:', error);
      alert('An error occurred while verifying the captcha. Please try again.');
    }
  };

  //Modal for when the attestation is being processed
  //--------------------------------------------------------------------------------
  const renderModal = () => {
    if (isLoading) {
      return (
       AttestationCreationModal()
      );
    } 
    return null;
  };


 // When attestation is created it shows the confirmation page
  //--------------------------------------------------------------------------------
  if(attestationUID) {
      return (
        <div className="min-h-screen flex flex-col bg-white text-black">
          <Navbar />
          <ConfirmationSection
            attestationUID={attestationUID}
            attestationData={attestationData}
            imageUrl={imageUrl}
            ecosystem={ecosystem}
            selectedProject={selectedProject}  
            selectedNetwork={selectedNetwork}       />
          <Footer />
        </div>
      );
    }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      
      <div className="flex justify-center relative w-full mt-10 px-8">
        {/* Left Column------------------------------------------------- */}
        {/* Project Card view section on the left hand side */}
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
        )}

        {/* Center Column ------------------------------------------------------------*/}
        {/* Form section in the middle */}
        {/* If isPreview is true, show the preview section */}
        {/* If isPreview is false, show the form section */}
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
            <p className='text-center mt-2 mb-2 text-gray-400'> 
              {attestationData.oneliner || 'Project description'}
            </p>
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
          </div>

          <div className="mt-20 mb-20  flex justify-center w-full">
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha}  />
          </div>

          <div className="flex justify-center space-x-6 mt-20 mb-20">
            <button
              className="px-4 py-2 w-1/5 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
              onClick={onSubmit}
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
          <label htmlFor="projectName" className="block text-sm font-medium leading-6 text-gray-900">
            A brief one line description of your project *
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="oneliner"
              name="oneliner"
              value={attestationData.oneliner}
              onChange={handleAttestationChange}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type Project Description Here"
            />
          </div>
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium leading-6 text-gray-900">
              What is the website URL of your project? * 
              
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

        {/* Right Column: Empty --------------------------------------------------------------*/}
        <div className="w-1/4">
        </div>
      </div>
      <Footer />
      {renderModal()}
    </div>
  );
}


//--------------------------------------------------------------------------------------------
