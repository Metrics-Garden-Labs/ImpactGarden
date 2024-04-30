// this is just the demo i used before until i get the lofi for the project onboarding 

//in this file, create an attestation with the project schema and add all of the fields to the database
//this should create the attestations

//TODO:  create a new schema for the database for the project data
        //have it linked to the user's fid
        //use their ethereum wallet as the attestor
        // also include the ecosystem in that schema, got the logic just need to add in 

//add image for project using uploadthing, store that in db

"use client";

//change the paths of the imports
import { AttestationNetworkType, networkContractAddresses } from '../components/networkContractAddresses';
import { useEAS } from '../../src/hooks/useEAS';
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import React, { useState, FormEvent } from 'react';
import { useGlobalState } from '../../src/config/config';
import { redirect } from 'next/navigation';
import  { UploadDropzone} from '../../src/utils/uploadthing';
import Navbar from '../components/navbar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NEXT_PUBLIC_URL } from '../../src/config/config';

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

export default function AttestDb() {

    const [attestationData, setAttestationData] = useState<AttestationData>({
        projectName: '',
        websiteUrl: '',
        twitterUrl: '',
        githubURL: '',
      });
      console.log('Attestation Data:', attestationData);

    const [walletAddress] = useGlobalState('walletAddress');
    const [fid] = useGlobalState('fid')
    const [ ethAddress] = useGlobalState('ethAddress')
    const [attestationUID, setAttestationUID] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [ecosystem, setEcosystem] = useState<string>('');
    console.log('Ecosystem', ecosystem);
    console.log('walletAddress', walletAddress);
    console.log('Fid', fid)
    console.log('ethAddress', ethAddress)

    //redirect if they have not signed in 
    // if (!fid) {
    //     redirect("/login?callbackUrl=/AttestDb")
    // }
    
    const { eas, schemaRegistry, currentAddress, selectedNetwork, handleNetworkChange } = useEAS();

    const handleNetworkChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as AttestationNetworkType;
    handleNetworkChange(selectedValue);
    console.log('Selected Network', selectedValue);
    };

    const handleEcosystemChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEcosystem = e.target.value as AttestationNetworkType
        setEcosystem(selectedEcosystem);
        console.log('Selected Ecosystem', selectedEcosystem);
    }

    const handleAttestationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
    };

    const createAttestation = async () => {
        if (!eas || !currentAddress) {
            console.error('EAS or currentAddress not available');
            return;
        }

        try {
            // Create main attestation
            //make this dynamic for the project needs
        const mainSchemaUid = '0x3608fb19fbaef55860432c4961d03ec250ceaa3f38db067953611cee5b128f80';
        const mainAttestation = await eas.attest({
        schema: mainSchemaUid,
        data: {
            recipient: currentAddress,
            expirationTime: undefined,
            revocable: true,
            data: new SchemaEncoder('string projectName, string websiteUrl, string twitterUrl, string githubURL, bytes32[] refUIDs').encodeData([
            { name: 'projectName', value: attestationData.projectName, type: 'string' },
            { name: 'websiteUrl', value: attestationData.websiteUrl, type: 'string' },
            { name: 'twitterUrl', value: attestationData.twitterUrl, type: 'string' },
            { name: 'githubURL', value: attestationData.githubURL, type: 'string' },
            { name: 'refUIDs', value: [], type: 'bytes32[]'}
            ]),
        },
        });
        const mainAttestationUID = await mainAttestation.wait();
        console.log('Main Attestation UID:', mainAttestationUID);
        setAttestationUID(mainAttestationUID);

        console.log('Attestations created successfully');
        // Reset form fields or perform any other necessary actions

        const newProject = {
            userFid: fid,
            ethAddress: currentAddress,
            //or
            //ethAddress: ethAddress,
            projectName: attestationData.projectName,
            websiteUrl: attestationData.websiteUrl,
            twitterUrl: attestationData.twitterUrl,
            githubUrl: attestationData.githubURL,
            ecosystem: ecosystem,
            logoUrl: imageUrl,
        };

        //api call to insert project into the database
        
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/addProjectDb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject)
        });
        const dbResponse = await response.json();
        console.log('insert project to db success', dbResponse);


        } catch (error) {
        console.error('Failed to create attestations:', error);
        alert('An error occurred while creating attestations. Please try again.');
        }
    };
    return (
      <>
      <Navbar />
        <div data-theme="light" className="min-h-screen w-full flex justify-center relative items-center">
        {/* <form onSubmit={onSubmit}> */}
        <div className='absolute right-4 top-4'>
          <ConnectButton />
        </div>
        <form>
          <h1 className="text-black">EAS, need to be logged in, fixed schema is sepolia</h1>
  
          <div className="sm:col-span-4 p-3">
            <label htmlFor="chain" className="block text-sm font-medium leading-6 text-gray-900">
              Select Attestation Network
            </label>
            <div className="mt-2">
              <select
                id="attestationChain"
                name="attestationChain"
                value={selectedNetwork}
                onChange={handleNetworkChangeEvent}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {Object.keys(networkContractAddresses).map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-4 p-3">
            <label htmlFor="chain" className="block text-sm font-medium leading-6 text-gray-900">
              What ecosysytem is your project contributing to?
            </label>
            <div className="mt-2">
              <select
                id="ecosystem"
                name="ecosystem"
                value={ecosystem}
                onChange={handleEcosystemChangeEvent}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {networks.map((network) => (
                  <option key={network} value={network}>
                    {network} Ecosystem
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          <div className="p-3">
            <h3>What is the name of your project?</h3>
            <input
              type="text"
              placeholder="Type Project Name here"
              name="projectName"
              value={attestationData.projectName}
              onChange={handleAttestationChange}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
  
          <div className="p-3">
            <h3>What is the website URL of your project?</h3>
            <input
              type="text"
              placeholder="Type the website URL here"
              name="websiteUrl"
              value={attestationData.websiteUrl}
              onChange={handleAttestationChange}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
  
          <div className="p-3">
            <h3>Please Input your Twitter URL</h3>
            <input
              type="text"
              placeholder="Type your Twitter URL here"
              name="twitterUrl"
              value={attestationData.twitterUrl}
              onChange={handleAttestationChange}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
  
          <div className="p-3">
            <h3>Please input the Github URL of your Project</h3>
            <input
              type="text"
              placeholder="Type your Github URL here"
              name="githubURL"
              value={attestationData.githubURL}
              onChange={handleAttestationChange}
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <h2>Please upload the logo of your project</h2>
          
          {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Logo of the project"
                    width={1000}
                    height={667}
                    className="w-full h-64 object-contain"
                />
            ) : (
                <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        setImageUrl(res[0].url);
                        console.log("Files: ", res);
                        console.log("Uploaded Image URL:", res[0].url);
                        console.log(setImageUrl)
                        alert("Upload Completed");
                    }}
                    onUploadError={(error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                    data-ut-element="button"
                />
            )}
  
          <h2 className="flex justify-center items-center py-2">Get your Attestation</h2>
  
          <div className="flex justify-center items-center py-2">
            <button className="btn items-center" type='button' onClick={createAttestation}>
              Get your Attestation
            </button>
          </div>
          <h2 className="flex justify-center items-center py-2">Your Attestation Uid</h2>
            <div className="flex justify-center items-center py-2">
                <textarea
                className="textarea textarea-bordered w-3/5 h-4/5"
                placeholder="Attestation Uid"
                value={attestationUID}
                readOnly
                />
            </div>
        </form>
      </div>
      </>
    );
    }