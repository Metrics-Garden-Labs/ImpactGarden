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
import { Project, Contribution, ContributionAttestation } from '@/src/types';
import AddContributionModal from './addContributionModal';
import { useGlobalState } from '@/src/config/config';
import { LuArrowUpRight } from 'react-icons/lu';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import { ethers } from 'ethers';
import { useEAS } from '@/src/hooks/useEAS';
import { EAS, EIP712AttestationParams, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import {getAttestationsByContribution} from '@/src/lib/db';
import { AttestationNetworkType } from '@/src/types';
import AttestationModal from './AttestationModal';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import {  getChainId } from '../components/networkContractAddresses';
import { useSwitchChain } from 'wagmi';



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
    //const [selectedProject] = useGlobalState('selectedProject');
    const [selectedProject] = useLocalStorage<Project | null>('selectedProject', null);
    const [isUseful, setIsUseful] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [attestationCount, setAttestationCount] = useState(0);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const { switchChain } = useSwitchChain();
    const [ contributionCards, setContributionCards ] = useState<Contribution[]>([]);
    const [user] = useLocalStorage("user", {
        fid: '',
        username: '',
        ethAddress: '',
      });
    // const router = useRouter();


    const projectName = selectedProject?.projectName || "";
    console.log('Selected project name:', projectName);
    //need to make the route something like /projects/:projectName

    useEffect(() => {
      const switchToProjectChain = async () => {
        if (selectedProject) {
          const chainId = getChainId(selectedProject.ecosystem as AttestationNetworkType);
          if (chainId) {
            try {
              await switchChain({ chainId });
            } catch (error) {
              console.error('Failed to switch network:', error);
            }
          }
        }
      };
  
      switchToProjectChain();
    }, [selectedProject, switchChain]);

    useEffect(() => {
      const fetchContributions = async () => {
        if (selectedProject) {
          const res = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectContributions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectName: selectedProject.projectName }),
          });
          const data = await res.json();
          if (res.ok) {
            setContributionCards(data.response);
          } else {
            console.error('Failed to fetch contributions:', data.error);
          }
        }
      };
      fetchContributions();
    }, [selectedProject, setContributionCards]);

    useEffect(() => {
      const fetchAttestationCount = async () => {
        if (selectedContribution) {
          try {
            const response = await fetch(`${NEXT_PUBLIC_URL}/api/getAttestationCount`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ contribution: selectedContribution.contribution }),
            });
    
            if (response.ok) {
              const data = await response.json();
              console.log('data:', data);
              const count = data.count;
              console.log('Attestation count:', count);
              setAttestationCount(count);
            } else {
              console.error('Error fetching attestation count:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching attestation count:', error);
          }
        }
      };
    
      fetchAttestationCount();
    }, [selectedContribution]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleContributionAdded = (newContribution: string) => {
    // Create a new contribution object with the received string
    const addedContribution: Contribution = {
      userFid: user.fid || '',
      projectName: selectedProject?.projectName || '',
      ecosystem: selectedProject?.ecosystem || '',
      contribution: newContribution,
      desc: '',
      link: '',
      easUid: '',
      ethAddress: walletAddress,
    };

    // Update the contributionCards state by adding the new contribution
    setContributionCards((prevContributions) => [...prevContributions, addedContribution]);
  };

  const tabClasses = (tabName:string) =>
  `cursor-pointer px-4 py-2 text-sm font-semibold  mr-2 ${
    activeTab === tabName
      ? 'border-b-2 border-black'
      : 'text-gray-600 hover:text-black'
  }`;

  console.log('selected contribution:', selectedContribution);

  //addinng conributions modal
  const addContribution = async (contribution: Contribution) => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/addContributionDb`, {
        method: 'POST',
        body: JSON.stringify(contribution),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Failed to add contribution');
        return;
      } else {
        console.log('Contribution added successfully', response);
        setContributionCards(prev => [...prev, contribution])
      }
      console.log('Contribution added successfully', response);
    
    } catch (error) {
      console.error('Failed to add contribution', error);
    }
  };

  const filteredContributions = contributions.filter((contribution) =>
  contribution.contribution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openmodal = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setIsModalOpen(true);
    //update selected project baased on the clicked contribution
  }

  const closeModal = () => {
    setSelectedContribution(null);
  }



  const renderContent = () => {
    switch (activeTab) {
      case 'attestations':
        return (
            <div className="px-3 bg-backgroundgray">
      
                <div className="mb-4 flex justify-between items-center">
                <div className="relative w-1/2">
                  <input
                    type="text"
                    placeholder="Search for a contribution..."
                    className="px-4 py-2 border border-gray-300 rounded-md w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute right-3 top-3 text-black">
                    <FaSearch />
                  </span>
                </div>
                <select className="px-4 py-2 bg-backgroundgray text-black rounded-full w-60 border-none focus:ring-0 focus:border-none">
                  <option>Sort by: Most Attestations</option>
                  {/* ...other sorting options */}
                </select>
              </div>
                <div className="mb-4">
                    </div>
                    <div className="grid grid-cols-3 gap-12">
                        {filteredContributions.map((contribution) => (
                        <div key={contribution.id} 
                             className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-lg w-full h-56 shadow-lg"
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
    <main className="flex-grow relative p-10 bg-backgroundgray w-full h-full">
                {/* //add contribution button */}
        {/* if the users fid matches the fid that registered the project they can add contributions */}
        {user.fid === selectedProject?.userFid && (
        <div className='absolute top-1.5 right-5'>
          <button 
            className='btn bg-headerblack text-white hover:bg-gray-200 hover:text-black px-2 py-1'
            onClick={() => setModalOpen(true)}
            >
              Add Contribution
          </button>
          <AddContributionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} addContribution={addContribution} addContributionCallback={handleContributionAdded}  />
        </div>
      )}
   
     
      <div className="mb-4 border-b border-gray-200">
      
        <nav className="flex space-x-4 text-black">
      <button
        className="lg:hidden" // Visible on small and medium screens, hidden on large and larger screens
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <IoIosMenu className="h-6 w-6" />
      </button>
      
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
      {isModalOpen && (
        <AttestationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contribution={selectedContribution!}
        attestationCount={attestationCount}
        project={selectedProject!}
        currentAddress={walletAddress}
        eas={eas || null}
        />
      )}
      
    </div>
    </div>
    </main>
  );
}