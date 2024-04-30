//profilepage.tsx

//this will be the project page from the lofi

//split into two parts

//there will be a sidebar that contains the project information

//there will be a main section that contains the header bar and the project information 

//async not supported in client components

'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosMenu } from "react-icons/io";
import Sidebar from './sidebar1';
import { getContributionsByProjectName } from '../../src/lib/db';
import { Project, Contribution, ContributionAttestation } from '@/src/types';
import AddContributionModal from './addContributionModal';
import {useRouter} from 'next/router';
import { useGlobalState } from '@/src/config/config';
import { LuArrowUpRight } from 'react-icons/lu';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import { ethers } from 'ethers';
import { useEAS } from '@/src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';


interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

interface ProfilePageProps {
    contributions: Contribution[];
    }


export default function ProfilePage({ contributions }: ProfilePageProps) {
    console.log('Contributions in profile page:', contributions);
    const [activeTab, setActiveTab] = useState('attestations');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { eas, currentAddress } = useEAS();
    const [fid] = useGlobalState('fid');
    const [walletAddress] = useGlobalState('walletAddress');
    const [selectedProject] = useGlobalState('selectedProject');
    const [isUseful, setIsUseful] = useState(false);
    const [feedback, setFeedback] = useState('');

    const projectName = selectedProject?.projectName || "";
    //need to make the route something like /projects/:projectName

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const tabClasses = (tabName:string) =>
  `cursor-pointer px-4 py-2 text-sm font-semibold  mr-2 ${
    activeTab === tabName
      ? 'border-b-2 border-black'
      : 'text-gray-600 hover:text-black'
  }`;

  //addinng conributions modal
  const addContribution = async (contribution: Contribution) => {
    try {
      const response = await fetch(`/api/addContributionDb`, {
        method: 'POST',
        body: JSON.stringify(contribution),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Failed to add contribution');
        return;
      }
      console.log('Contribution added successfully', response);
      // Reload the window to show the new contribution
      // Maybe not the best as it signs me out of the app, gotta figure that out.
    } catch (error) {
      console.error('Failed to add contribution', error);
    }
  };

  const filteredContributions = contributions.filter((contribution) =>
  contribution.contribution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openmodal = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    //update selected project baased on the clicked contribution
  }

  const closeModal = () => {
    setSelectedContribution(null);
  }

  const renderModal = () => {
    if (!selectedContribution) return null;
    //could try make the contribution global state the same way the project is

    const createAttestation = async () => {
      if (!eas || !currentAddress) {
        console.error('EAS or current address not available');
        return null;
      }

      try {
        //this schema is just a prototype to get the functionality working for now
        const attestationSchema =  "0x0ea974daef377973de71b8a206247f436f67364853a10d460c2623d18035db12";
        const schemaEncoder = new SchemaEncoder('string Contribution, bool Useful, string Feedback');
        const encodedData = schemaEncoder.encodeData([
          { name: 'Contribution', type: 'string', value: selectedContribution.contribution },
          { name: 'Useful', type: 'bool', value: isUseful }, 
          { name: 'Feedback', type: 'string', value: feedback },
        ]);

        const provider =  new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const easop = new EAS('0x4200000000000000000000000000000000000021');
        easop.connect(signer);
        const delegatedSigner = await easop.getDelegated();
        console.log('Delegated Signer:', delegatedSigner);

        const easnonce = await easop.getNonce(walletAddress);
        console.log('EAS Nonce:', easnonce);

        const attestation: EIP712AttestationParams = {
          schema: attestationSchema,
          recipient: selectedProject?.ethAddress || '', //this logic should hold, they have to be on the project to get here
          expirationTime: BigInt(9973891048),
          revocable: true,
          refUID: selectedContribution.easUid || '',
          data: encodedData,
          value: BigInt(0),
          deadline: BigInt(9973891048),
          nonce: easnonce,
        };
        console.log('Attestation:', attestation);
        

        const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);
        console.log('Delegated Signature:', signDelegated);

        attestation.data = encodedData;
        const signature = signDelegated.signature;

        const dataToSend = {
          ...attestation,
          signature: signature,
          attester: walletAddress,
        };

        const serializedData = JSON.stringify(dataToSend, (key, value) =>
        typeof value === 'bigint' ? '0x' + value.toString(16) : value
        );

        const response = await fetch(`/api/delegateAttestation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: serializedData,
        });
        const responseData = await response.json();
        console.log('Response:', responseData);

        if (responseData.success && responseData.attestationUID) {
          console.log('Attestation UID:', responseData.attestationUID);
          return responseData.attestationUID;
        } else {
          console.error('Failed to retrieve attestation UID from the API response');
        }

        const newAttestation = {
          userFid: fid,
          projectName: selectedProject?.projectName,
          contribution: selectedContribution.contribution,
          ecosystem: selectedProject?.ecosystem,
          attestationUID: responseData.attestationUID,
          attesterAddy: walletAddress,
          attestationType: isUseful ? 'Useful' : 'Not Useful',
        }

        const response1 = await fetch(`/api/addContributionAttestationDb`, {
          method: 'POST',
          body: JSON.stringify(newAttestation),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const dbResponse = await response1.json();
        console.log('DB Response, insert attestation success:', dbResponse);
      } catch (error) {
        console.error('Error creating attestation/ adding to db:', error);
      }



    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div 
          className="relative m-auto p-8 bg-white rounded-lg shadow-lg max-w-4xl w-1/4 h-1/2 mx-4 md:mx-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center pt-8 p-2">
            <h2 className="text-xl font-bold mb-4">{selectedContribution.contribution}</h2>
          </div>
          <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
          <div className="mb-4 items-center py-3">
            <h3 className="font-semibold text-center">Description</h3>
            <p className='text-left'>{selectedContribution.desc}</p>
          </div>
          <div className="mb-4 ">
            <h3 className="font-semibold text-center">Link/Evidence</h3> 
            <a href={selectedContribution.link} className="text-gray-500 text-left hover:text-gray-300 visited:text-indigo-600 flex items-center">
                {selectedContribution.link}
                <LuArrowUpRight className="ml-1" />
                </a>
          </div>
          {/* <div className="mb-4 ">
            <h3 className="font-semibold text-center">Attestations</h3>
            <p>Info on who has attested and maybe some more stuff</p>
          </div> */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isUseful}
                onChange={(e) => setIsUseful(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Useful Contribution</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Feedback:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
            ></textarea>
          </div>
          <div className='mb-4 text-center py-3'>
          <button className='btn text-center bg-headerblack text-white hover:bg-blue-500'
            onClick={createAttestation}>
            Attest to this Contribution
          </button>
          </div>
          <button onClick={closeModal} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
          <RxCross2 className='w-5 h-5'/>
            </button>
        </div>
        
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'attestations':
        return (
            <div className="p-6 bg-backgroundgray">
                <div className="mb-4 flex justify-end">
                    <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 bg-backgroundgray text-black rounded-full w-60 border-none focus:ring-0 focus:border-none">
                        <option>Sort by: Most Attestations</option>
                        {/* ...other sorting options */}
                    </select>
                    <div className="relative w-80">
                        <input
                        type="text"
                        placeholder="Search for a contribution..."
                        className="px-4 py-2 border border-gray-300 rounded-full w-full"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-3 top-3 text-black">
                        <FaSearch />
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="grid grid-cols-3 gap-12">
                        {filteredContributions.map((contribution) => (
                        <div key={contribution.id} 
                             className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-xl w-full h-60 shadow-lg"
                             onClick={() => openmodal(contribution)}>
                            <h3 className="mb-2 text-xl font-semibold ">{contribution.contribution}</h3>
                            <p className='text-gray-500'>{contribution.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          );
      case 'insights':
        return <div className='text-black'>Content for Insights</div>;
      case 'charts':
        return <div className='text-black'>Content for Charts</div>;
      default:
        return <div className='text-black'>Select a tab</div>;
    }
  };

  return (
    <main className="flex-grow relative p-10 bg-backgroundgray w-fulll h-full">
     
      <div className="mb-4 border-b border-gray-200">
      
        <nav className="flex space-x-4 text-black">
      <button
        className="lg:hidden" // Visible on small and medium screens, hidden on large and larger screens
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <IoIosMenu className="h-6 w-6" />
      </button>

        {/* //add contribution button */}
      <div className='absolute top-4 right-4'>
        <button onClick={() => setModalOpen(true)}>
            Add Contribution
        </button>
        <AddContributionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} addContribution={addContribution} />
        </div>
      
          <button onClick={() => setActiveTab('attestations')} className={tabClasses('attestations')}>
            Contributions
          </button>
          <button onClick={() => setActiveTab('insights')} className={tabClasses('insights')}>
            Insights
          </button>
          <button onClick={() => setActiveTab('charts')} className={tabClasses('charts')}>
            Charts
          </button>
        </nav>
      </div>
    

      <div className="flex">
      

    <div
        className={`flex-1 p-4 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-0 ml-64' : ''
        }`}
        onClick={() => {
          if (sidebarOpen) {
            setSidebarOpen(false);
          }
        }}
      >
      {renderContent()}
      {renderModal()}
    </div>
    </div>
    </main>
  );
}