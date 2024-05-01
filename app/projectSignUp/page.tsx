// app/projectSignUp/page.tsx
"use client";

import { AttestationNetworkType, networkContractAddresses } from '../components/networkContractAddresses';
import { useEAS } from '../../src/hooks/useEAS';
import { EIP712AttestationParams, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import React, { useState } from 'react';
import { useGlobalState } from '../../src/config/config';
import { redirect } from 'next/navigation';
import { UploadDropzone } from '../../src/utils/uploadthing';
import Navbar from '../components/navbar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NEXT_PUBLIC_URL } from '../../src/config/config';
import { ethers } from 'ethers';
import Image from 'next/image';

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
  const [fid] = useGlobalState('fid');
  const [ethAddress] = useGlobalState('ethAddress');
  const [attestationUID, setAttestationUID] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ecosystem, setEcosystem] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
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

  const createAttestation = async () => {
    if (!eas || !currentAddress) {
      console.error('EAS or currentAddress not available');
      return;
    }

    try {
      setIsLoading(true);
      const mainSchemaUid = '0x45ea2d603b7dfcec03e1e4a5d65a22216e5f7a3c3bf1e61560c58c888f2c7f3f';
      const schemaEncoder = new SchemaEncoder('string projectName, string websiteUrl, string twitterUrl, string githubURL, bool MGL');
      const encodedData = schemaEncoder.encodeData([
        { name: 'projectName', value: attestationData.projectName, type: 'string' },
        { name: 'websiteUrl', value: attestationData.websiteUrl, type: 'string' },
        { name: 'twitterUrl', value: attestationData.twitterUrl, type: 'string' },
        { name: 'githubURL', value: attestationData.githubURL, type: 'string' },
        { name: 'MGL', value: true, type: 'bool' }
      ]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
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
            userFid: fid,
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Processing Attestation</h2>
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                {/* Loading spinner SVG */}
              </svg>
              <p>Please wait while your attestation is being processed...</p>
            </div>
          </div>
        </div>
      );
    } else if (attestationUID) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Attestation Created</h2>
            <p>Your attestation has been successfully created.</p>
            <p>Attestation UID: {attestationUID}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setAttestationUID('')}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <div data-theme="light" className="min-h-screen w-full flex justify-center relative items-center">
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
              What ecosystem is your project contributing to?
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
            <Image
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
                console.log(setImageUrl);
                alert("Upload Completed");
              }}
              onUploadError={(error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          )}

          <h2 className="flex justify-center items-center py-2">Get your Attestation</h2>

          <div className="flex justify-center items-center py-2">
            <button className="btn items-center" type="button" onClick={createAttestation}>
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
      {renderModal()}
    </>
  );
}