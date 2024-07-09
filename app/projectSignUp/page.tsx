// app/projectSignUp/page.tsx
//i am going to change this branch to work for the optimism schema and try to get the multi attest by delegation working

"use client";

import {  networkContractAddresses, getChainId } from '../components/networkContractAddresses';
import { useEAS, useSigner } from '../../src/hooks/useEAS';
import { AttestationRequestData, EAS, EIP712AttestationParams, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import React, { FormEvent, useEffect, useState } from 'react';
import { WHITELISTED_USERS, useGlobalState } from '../../src/config/config';
import { UploadDropzone } from '../../src/utils/uploadthing';
import { NEXT_PUBLIC_URL } from '../../src/config/config';
import { N, ethers } from 'ethers';
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
import { Alchemy, Network, Utils, Wallet } from "alchemy-sdk";
import { isMobile } from 'react-device-detect';
import { set } from 'zod';
import pinataSDK from '@pinata/sdk';


type AttestationData = {
  projectName: string;
  oneliner: string | "";
  websiteUrl: string;
  twitterUrl: string;
  githubURL: string;
  farcaster: string;
  mirror: string;
};

type AttestationData1 = {
  issuer: string;
  farcasterID: string;
  projectName: string;
  category: string;
  parentProjectRefUID: string;
  metadataType: string;
  metadataURL: string;
};

const networks: AttestationNetworkType[] = [
  'Ethereum', 'Optimism', 'Base', 'Arbitrum One', 'Polygon',
  'Scroll', 'Celo', 'Blast', 'Linea'
];

type CategoryKey = 'CeFi' | 'Crosschain' | 'DeFi' | 'Governance' | 'NFT' | 'Social' | 'Utilities';

const categories: { [key in CategoryKey]: string } = {
  CeFi: 'CeFi',
  Crosschain: 'Crosschain',
  DeFi: 'DeFi',
  Governance: 'Governance',
  NFT: 'NFT',
  Social: 'Social',
  Utilities: 'Utilities'
};


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
    mirror: '',
  });

  //new attestation data, not sure if we have to worry to much if we are going to take all of the info from the agora api
  //first schema contains
  //FarcasterID
  //Issuer - MGL or OP Atlas in this case

  //second schema contains
  //schema 472
  //farcasterID
  //Project Name
  //Category
  //parent projectRefUID for (only for the contributions/subprojects)
  //metadata type - not sure what this is actually
  //metadataURL - all of the stuff that goes in pinata. 
  //third schema contains
  //schema 470
  //round number which will be 4
  //project ref UID - first schema the uid of the project that is being attested - this is going to have to be a separate attestation becasue we need the other attestationUIDs first 
  //farcasterID - the user's farcasterID
  //MetaData snapshot Ref - this is the second schema attestationUID
  //at some point in the ui will have to tell the user that they are going to have to sign two transactions
  //the fitst attestation uid witll be attestationUID
  //the second attestation uid will be attestationUID1 




  const [attestationData1, setAttestationData1] = useState<AttestationData1>({
    issuer: 'MGL',
    farcasterID: user.fid,
    projectName: '',
    category: '',
    parentProjectRefUID: '',
    metadataType: '',
    metadataURL: '',
  });


  console.log('Attestation Data:', attestationData);

  const [selectedProject, setSelectedProject] = useLocalStorage<Project | null>('selectedProject', null);
  const [captcha, setCaptcha] = useState<string | null>("");
  const [fid] = useGlobalState('fid');
  const [ethAddress] = useGlobalState('ethAddress');
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [attestationUID1, setAttestationUID1] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<string>('Optimism');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();
  const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const NO_EXPIRATION = 0n;
  const [selectedCategories, setSelectedCategories] = useState<{ [key in CategoryKey]: boolean }>({
    CeFi: false,
    Crosschain: false,
    DeFi: false,
    Governance: false,
    NFT: false,
    Social: false,
    Utilities: false
  });
  
  console.log('Ecosystem', ecosystem);
  console.log('walletAddress', walletAddress);
  console.log('Fid', fid);
  console.log('ethAddress', ethAddress);

  const { eas, currentAddress, selectedNetwork, address, handleNetworkChange } = useEAS();
  console.log('selectedNetwork', networkContractAddresses[selectedNetwork]?.attestAddress);

  const signer = useSigner();

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
    if (attestationUID1) {
      const project: Project = {
        userFid: user.fid,
        projectName: attestationData.projectName,
        oneliner: attestationData.oneliner,
        websiteUrl: attestationData.websiteUrl,
        twitterUrl: attestationData.twitterUrl,
        githubUrl: attestationData.githubURL,
        logoUrl: imageUrl,
        projectUid: attestationUID1,
        primaryprojectuid: attestationUID,
        ecosystem: ecosystem,
        // Add other relevant properties from the attestationData
      };
      setSelectedProject(project);
    }
  }, [attestationUID1, attestationData, imageUrl, user.fid, ecosystem, setSelectedProject]);

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

  const handleCategoryToggle = (category: CategoryKey) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const formatCategories = (categories: { [key in CategoryKey]: boolean }) => {
    return Object.keys(categories)
      .filter(key => categories[key as CategoryKey])
      .join(', ');
  };
  


  const handleNext = () => {
    // Ensure required fields are filled before allowing a preview
    if (!attestationData.projectName || !ecosystem || !attestationData.oneliner || !attestationData.websiteUrl) {
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

  //put in the info for the first attestation with the issuer and the farcasterID
  const createAttestation1 = async () => {
    setIsLoading(true);
    console.log('Starting createAttestation1');
    console.log('User FID:', user.fid);
    console.log('Selected Network:', selectedNetwork);
    console.log('Current Address:', currentAddress);
    console.log('Signer:', signer);
    //dont worry about the captcha for this one yet
    if (!user.fid || user.fid === '') {
      alert('User not logged in, please login to continue');
      return;
    }
    if (!eas || !currentAddress) {
      console.error('Wallet not connected. Please connect your wallet to continue');
      return;
    }
    if (!signer) {
      console.error('Signer not available');
      return;
    }

    // If all checks pass, continue with the function
    try {
      const schema1 = '0x7ae9f4adabd9214049df72f58eceffc48c4a69e920882f5b06a6c69a3157e5bd';
      //ive never used the schema encoder with spaces before, hopefully this works, otherwise i can iterate
      const schemaEncoder1 = new SchemaEncoder(
        `uint256 farcasterID, string Issuer`
      );

      const encodedData1 = schemaEncoder1.encodeData([
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'Issuer', value: 'MGL', type: 'string' },
      ]);
      console.log('encoded data 1', encodedData1)

      const eas2 = new EAS(networkContractAddresses[selectedNetwork]?.attestAddress);
      eas2.connect(signer);
      //i dont think i need to delegate the signer becasue we are signing the attestation and there is no recipient
      const easnonce2 = await eas2.getNonce(walletAddress);
      //i dont actaully think i need the nonce for this 

      const attestationdata1: AttestationRequestData = {
        recipient: currentAddress,
        data: encodedData1,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: ZERO_BYTES32,
        value: 0n,
      }
      console.log('attestation1 data', attestationdata1)

      const dataToSend = {
        schema: schema1,
        ...attestationdata1,
      }

      //might not need to add the bigint conversion because i took the values from the sdk
      const serialisedData = JSON.stringify(dataToSend, (key, value) =>
        typeof value === 'bigint' ? "0x" + value.toString(16) : value
      );

      //now i need to send the data to the backend using a different api
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/projectAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serialisedData,
      });
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (responseData.success) {
        console.log('Attestations created successfully');
        const attestationnUID = responseData.attestationUID;
        setAttestationUID(attestationUID);
        console.log('Attestation UID:', attestationnUID);

        await createAttestation2(attestationnUID)
        // return attestationUID;
        
      } else {
        throw new Error (`Failed to create attestations, Error: ${responseData.error}`)
      }
      ;
      //i am not going to add this one to the database, just checking to see if it works
      //i dont think i do need to add it to the db, mmaybe just the attestationUID

    } catch (error) {
      console.error('Failed to create attestation 1:', error);
      alert('An error occurred while creating attestation 1. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
 
  //put the info into pinata 
  const pinataUpload = async () => {
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY});

    try{
      const attestationMetadata = {
        name: attestationData.projectName,
        farcaster: user.fid,
        description: attestationData.oneliner,
        website: attestationData.websiteUrl,
        twitter: attestationData.twitterUrl,
        github: attestationData.githubURL,
        projectREFId: attestationUID,
        logoURL: imageUrl,
        mirror: attestationData.mirror,
        categories: formatCategories(selectedCategories),
      };

      const res = await pin.pinJSONToIPFS(attestationMetadata);
      if (!res || !res.IpfsHash) {
        throw new Error('Invalid response from Pinata');
      }
      const pinataURL = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      console.log('Pinata URL:', pinataURL);
      return pinataURL;
    } catch (error) {
      console.error('Failed to upload to pinata:', error);
      alert('An error occurred while uploading to pinata. Please try again.');
    }
  }

  //the attestation that will include the metadata and the parent project
  const createAttestation2 = async (attestationUID: string) => {
     //it will also only be completed when the last attestation is completed
     //there are 2 attestations going to be made, the first will be made with our wallet
     //this one will be delegated
     console.log('Starting createAttestation2');
    console.log('User FID:', user.fid);
    console.log('Selected Network:', selectedNetwork);
    console.log('Current Address:', currentAddress);
    console.log('Signer:', signer);
    console.log('Attestation UID:', attestationUID);
     if (!user.fid || user.fid === '') {
      alert('User not logged in, please login to continue');
      return;
    }
    if (!eas || !currentAddress) {
      console.error('Wallet not connected. Please connect your wallet to continue');
      return;
    }
    if (!signer) {
      console.error('Signer not available');
      return;
    }

    // Upload to Pinata and get the URL
    const pinataURL = await pinataUpload();
    console.log('Pinata URL:', pinataURL);
    if (!pinataURL) {
      console.error('Failed to get Pinata URL');
      return;
    }

    try{
      const schema2 = '0xe035e3fe27a64c8d7291ae54c6e85676addcbc2d179224fe7fc1f7f05a8c6eac';
      //need to do some research into what actually the metadata type is. 
      const schemaEncoder2 = new SchemaEncoder(
        'bytes32 projectRefUID, uint256 farcasterID, string name, string category, bytes32 parentProjectRefUID, uint8 metadataType, string metadataURL'
      );

      //for the attestaion uid this will work in this test, however i need to store this as a separate value,
      //for the confirmation to show i need to also make it dependeent of the attestationUID2
      //which will be the result of this attestation
      //the other metadata will be stored in the pinata url which i am yet to create. 
      const encodedData2 = schemaEncoder2.encodeData([
        { name: 'projectRefUID', value: attestationUID, type: 'bytes32' },
        { name: 'farcasterID', value: user.fid, type: 'uint256' },
        { name: 'name', value: attestationData.projectName, type: 'string' },
        { name: 'category', value: formatCategories(selectedCategories), type: 'string' },
        { name: 'parentProjectRefUID', value: ZERO_BYTES32, type: 'bytes32' },
        { name: 'metadataType', value: '0', type: 'uint8' },
        { name: 'metadataURL', value: pinataURL, type: 'string' },
      ]);
      const eas3 = new EAS(networkContractAddresses[selectedNetwork]?.attestAddress);
      eas3.connect(signer);
      const delegatedSigner = await eas3.getDelegated();
      const easnonce = await eas3.getNonce(currentAddress);

      const attestationdata2: EIP712AttestationParams = {
        schema: schema2,
        recipient: currentAddress,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        refUID: attestationUID,
        data: encodedData2,
        value: 0n,
        deadline: NO_EXPIRATION,
        nonce: easnonce,
      };
      console.log('Attestation Data 2:', attestationdata2);

      const signDelegated = await delegatedSigner.signDelegatedAttestation(attestationdata2, signer);
      console.log('Sign Delegated:', signDelegated); 

      attestationdata2.data = encodedData2;
      const signature = signDelegated.signature;

      const dataToSend2 = {
        ...attestationdata2,
        signature: signature,
        attester: currentAddress,
      };

      const serialisedData2 = JSON.stringify(dataToSend2, (key, value) =>
          typeof value === 'bigint' ? "0x" + value.toString(16) : value
        );

      console.log('Serialised Data 2:', serialisedData2);

      const response2 = await fetch(`${NEXT_PUBLIC_URL}/api/delegateAttestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: serialisedData2,
      });

      if(!response2.ok) {
        const errorDetails = await response2.json();
        throw new Error(`Error: ${response2.status} - ${errorDetails.message || response2.statusText}`);
      }

      const responseData2 = await response2.json();
      console.log('Response Data:', responseData2);

      if (responseData2.success) {
          setAttestationUID1(responseData2.attestationUID);
          console.log('Attestations created successfully');
        
          const primaryprojectuid = attestationUID
          const projectUid = responseData2.attestationUID;
          console.log('Project UID:', projectUid);
        
          const newProject = {
            userFid: user.fid,
            ethAddress: currentAddress,
            projectName: attestationData.projectName,
            websiteUrl: attestationData.websiteUrl,
            oneliner: attestationData.oneliner,
            twitterUrl: attestationData.twitterUrl,
            githubUrl: attestationData.githubURL,
            ecosystem: ecosystem,
            primaryprojectuid: primaryprojectuid,
            projectUid: projectUid,
            logoUrl: imageUrl,
          };

          //Add project to database
        
          try {
            const response1 = await fetch(`${NEXT_PUBLIC_URL}/api/addProjectDb`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newProject)
            });
          
            // Check if the response status indicates a successful request
            if (!response1.ok) {
              // Extract error message from the response body if available
              const errorDetails = await response1.json();
              throw new Error(`Error: ${response1.status} - ${errorDetails.message || response1.statusText}`);
            }
          
            // Parse the JSON response
            const dbResponse = await response1.json();
            console.log('Insert project to db success:', dbResponse);
          } catch (error:any) {
            // Log the error message
            console.error('Insert project to db failed:', error.message);
          }
          
      } else {
        throw new Error (`Failed to create attestations, Error: ${responseData2.error}`)
      }
    } catch (error) {
      console.error('Failed to create attestation 2:', error);
      alert('An error occurred while creating attestation 2. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log('starting on submit')
    console.log("Captcha value:", captcha);
    console.log('Wallet Address:', address);
  
    //First, check if the CAPTCHA has been completed
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
    //commenting this out for the test
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
        //i am testing the new attestation.
        //maybe split these into a different try block for error handling and to figure out where the error is coming from.  
        await createAttestation1();
        console.log('starting second attestation')
        // await createAttestation2();
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
  if(attestationUID1) {
      return (
        <div className="min-h-screen flex flex-col bg-white text-black">

          <ConfirmationSection
            attestationUID={attestationUID1}
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

      
      {!address && (
        <div role="alert" className="alert alert-warning rounded-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 " fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>Alert: Wallet not connected! Please connect your waller to continue.</span>
      </div>
      )}
  
  <div className="flex flex-col md:flex-row lg:flex-row justify-center items-start w-full mt-10 px-8 md:px-8">
    {/* Left Column------------------------------------------------- */}
    {/* Project Card view section on the left hand side */}
    {/* Hide the left column on small screens*/}
    {isPreview ? (
      <div className="hidden md:block md:w-1/2 lg:w-1/3 pr-0 md:pr-8 mb-8 md:mb-0">
        <h1 className="font-bold text-2xl">Register a project</h1>
        <p className="text-gray-600 mt-2">Project preview & confirmation</p>
      </div>
    ) : (
      <div className="hidden md:block md:w-1/2 lg:w-1/3 pr-8">
        <div className="sticky top-0">
          <h1 className="font-bold text-2xl">Register a project</h1>
          <p className="text-gray-600 mt-2">Tell us more about your project</p>
          <h2 className="font-semibold mt-10 pb-10 text-lg">Project card preview</h2>
          
          <div className="shadow-2xl rounded mt-6 mx-auto md:max-w-2/3 lg:max-w-1/3 ">
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
              <h3 className="text-center mt-2 font-semibold text-gray-500">
                Categories: {formatCategories(selectedCategories) || 'None'}
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

    {/* Center Column ------------------------------------------------------------*/}
    {/* Form section in the middle */}
    {/* If isPreview is true, show the preview section */}
    {/* If isPreview is false, show the form section */}
    {isPreview ? (
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
          <h3 className="text-center mt-2 font-semibold text-gray-500">
                Categories: {formatCategories(selectedCategories) || 'None'}
          </h3>
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


        {/* commented out the recaotcha for testing */}
        <div className="mt-20 mb-20 flex justify-center w-full">
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha}  />
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
    ) : (
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
              required
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
              required
            />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mt-4">Categories *</h2>
          <div className="flex flex-wrap mt-2">
            {Object.keys(categories).map((key) => (
              <button
                key={key}
                onClick={() => handleCategoryToggle(key as CategoryKey)}
                className={`mb-2 mr-2 px-4 py-2 rounded-lg text-sm ${
                  selectedCategories[key as CategoryKey] ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {selectedCategories[key as CategoryKey] ? '✓' : '+'} {categories[key as CategoryKey]}
              </button>
            ))}
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
              onChange={handleAttestationChange}
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

        {/* input for the farcaster channel 
        at the minute it autocompletes the logged in farcaster account, 
        guess this give the user to change only if they want to*/}
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
              onChange={handleAttestationChange}
              className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type Farcaster here"
              required
            />
          </div>
        </div>

        {/* input for the mirror channel */}
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
              onChange={handleAttestationChange}
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
              console.log(setImageUrl);
              alert("Upload Completed");
            }}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        )}

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
    <div className="hidden lg:block lg:w-1/3">
    </div>
  </div>
  <Footer />
  {renderModal()}
</div>
    );
}