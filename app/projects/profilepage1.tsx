'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosArrowBack, IoIosMenu } from "react-icons/io";
import { Project, ContributionWithAttestationCount, AttestationNetworkType, AttestationDisplay, Contribution, OnchainBuildersDisplay } from '@/src/types';
import AddContributionModal from './addContributionModal';
import { useGlobalState } from '@/src/config/config';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import { getChainId } from '../../src/utils/networkContractAddresses';
import { useSwitchChain } from 'wagmi';
import AttestationModal from './AttestationModal';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Sidebar from './smSidebar';
import { useEAS } from '@/src/hooks/useEAS';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect'; // Import the hook
import Link from 'next/link';
import { easScanEndpoints } from '@/src/utils/easScan';
import Image from 'next/image';
import { format } from 'date-fns';
import { GovRandADisplay, GovCollabAndOnboardingDisplay, GovInfraAndToolingDisplay, GovStructuresDisplay } from '@/src/types';
import AttestationModalView from '../components/attestations/AttestationModalView';

function isGovRandADisplay(attestation: AttestationDisplay): attestation is GovRandADisplay {
  return (attestation as GovRandADisplay).useful_for_understanding !== undefined;
}

function isGovCollabAndOnboardingDisplay(attestation: AttestationDisplay): attestation is GovCollabAndOnboardingDisplay {
  return (attestation as GovCollabAndOnboardingDisplay).governance_knowledge !== undefined;
}

function isGovInfraAndToolingDisplay(attestation: AttestationDisplay): attestation is GovInfraAndToolingDisplay {
  return (attestation as GovInfraAndToolingDisplay).likely_to_recommend !== undefined;
}

function isGovStructuresOpDisplay(attestation: AttestationDisplay): attestation is GovStructuresDisplay {
  return (attestation as GovStructuresDisplay).examples_of_usefulness !== undefined;
}

function isOnchainBuildersDisplay(attestation : AttestationDisplay): attestation is OnchainBuildersDisplay {
  return (attestation as OnchainBuildersDisplay).explanation == undefined;
}

interface ProfilePageProps {
  contributions: Contribution[];
  project: Project;
  projectAttestationCount: number;
}

export default function ProfilePage({ 
  contributions: initialContributions, 
  project, 
  projectAttestationCount,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('contributions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContribution, setSelectedContribution] = useState<ContributionWithAttestationCount | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttestation, setSelectedAttestation] = useState<AttestationDisplay | null>(null);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);    
  const { eas } = useEAS();
  const [fid] = useGlobalState('fid');
  const [walletAddress] = useGlobalState('walletAddress');
  const [isUseful, setIsUseful] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attestationCount, setAttestationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { switchChain } = useSwitchChain();
  const [contributions, setContributions] = useState< Contribution[]>(initialContributions);
  const [contributionCards, setContributionCards] = useState<ContributionWithAttestationCount[]>([]);
  const [recentAttestations, setRecentAttestations] = useState<AttestationDisplay[]>([]);
  const [recentAttestationsLoading, setRecentAttestationsLoading] = useState(true);
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });

  const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
  const pathname = usePathname(); // Use usePathname to get the current path
  const router = useRouter(); // Use useRouter for navigation

  useEffect(() => {
    const switchToProjectChain = async () => {
      if (project) {
        const chainId = getChainId(project.ecosystem as AttestationNetworkType);
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
  }, [project, switchChain]);

  useEffect(() => {
    if (activeTab === 'insights') {
      fetchRecentAttestations();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchProjectWithContributionCount = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectsWithContributionCount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectName: project.projectName }),
        });

        if (response.ok) {
          const data = await response.json();
          setContributions(data.contributions);
        } else {
          console.error('Error fetching project:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectWithContributionCount();
  }, [project]);



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
            const count = data.count;
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

  useEffect(() => {
    const contributionId = searchParams.get('contribution');
    if (contributionId) {
      const contribution = contributions.find(c => c.id === Number(contributionId));
      if (contribution) {
        setSelectedContribution(contribution);
        //setIsModalOpen(true);
      }
    }
  }, [searchParams, contributions]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchRecentAttestations = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/getAttestationsByProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName: project.projectName }),
      });

      const responseData = await response.json();
      console.log('Fetched attestation data:', responseData);

      if (responseData && responseData.attestations) {
        setRecentAttestations(responseData.attestations);
      }
    } catch (error) {
      console.error('Error fetching attestations:', error);
    } finally {
      setRecentAttestationsLoading(false);
    }
  };

  const handleContributionAdded = (newContribution: string) => {
    const addedContribution: ContributionWithAttestationCount = {
      userFid: user.fid || '',
      projectName: project?.projectName || '',
      ecosystem: project?.ecosystem || '',
      governancetype: '',
      secondaryecosystem: '',
      category: '',
      subcategory: '',
      contribution: newContribution,
      desc: '',
      link: '',
      primarycontributionuid: '',
      easUid: '',
      ethAddress: walletAddress,
      attestationCount: 0, // Initial attestation count is 0
    };

    setContributionCards((prevContributions) => [...prevContributions, addedContribution]);
  };

  const tabClasses = (tabName: string) =>
    `cursor-pointer px-4 py-2 text-sm font-semibold mr-2 ${
      activeTab === tabName ? 'border-b-2 border-black' : 'text-gray-600 hover:text-black'
    }`;

  const addContribution = async (contribution: ContributionWithAttestationCount) => {
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
        setContributionCards((prev) => [...prev, contribution]);
      }
    } catch (error) {
      console.error('Failed to add contribution', error);
    }
  };

  const renderAttestationContent = (attestation: AttestationDisplay) => {
    if (isGovRandADisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Governance and Analytics</p>
          <p className='text-sm text-gray-500 mb-2'>Useful for Understanding: {attestation.useful_for_understanding}</p>
          <p className='text-sm text-gray-500 mb-2'>Effective for Improvements: {attestation.effective_for_improvements}</p>
          <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p>
        </>
      );
    }
  
    if (isGovCollabAndOnboardingDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Collaboration and Onboarding</p>
          <p className='text-sm text-gray-500 mb-2'>Governance Knowledge: {attestation.governance_knowledge}</p>
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.recommend_contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
          <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p>
        </>
      );
    }
  
    if (isGovInfraAndToolingDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Infrastructure and Tooling</p>
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.likely_to_recommend}</p>
          <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p>
        </>
      );
    }

    if (isGovStructuresOpDisplay(attestation)) {
      return(
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
          <p className='text-sm text-gray-500 mb-2'>Examples of Usefulness: {attestation.examples_of_usefulness}</p>
          <p className='text-sm text-gray-500 mb-2'>Explanation: {attestation.explanation}</p>
        </>
      );
    }
    
    if(isOnchainBuildersDisplay(attestation)) {
      return (
        <>
          <p className='text-md text-black mb-2'>{attestation.contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Recommendation: {attestation.recommend_contribution}</p>
          <p className='text-sm text-gray-500 mb-2'>Feeling if didn’t exist: {attestation.feeling_if_didnt_exist}</p>
        </>
      );
    }
  
    // Default case for generic attestations
    if ('feedback' in attestation) {
      return (
        <>
          <p className='text-sm text-gray-500 mb-2'>Feedback: {attestation.feedback}</p>
          <p className='text-sm text-gray-500 mb-2'>Rating: {attestation.rating}</p>
        </>
      );
    }
  
    return null;
  };
  
  const filteredContributions = contributions.filter((contribution) =>
    contribution.contribution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openmodal = (contribution: ContributionWithAttestationCount) => {
    setSelectedContribution(contribution);
    setIsModalOpen(true);
    router.push(`${pathname}?contribution=${contribution.id}`);
  };

  const handleAttestationClick = (attestation: AttestationDisplay) => {
    setSelectedAttestation(attestation);
    setIsAttestationModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContribution(null);
    setIsModalOpen(false);
    router.push(pathname);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'contributions':
        return (
          <div className="px-3 bg-backgroundgray">
            <div className="mb-4 flex justify-between items-center flex-col sm:flex-row">
              <div className="relative w-full sm:w-1/2 mb-2 sm:mb-0">
                <input
                  type="text"
                  placeholder="Search for a contribution..."
                  className="px-4 py-2 border border-gray-300 rounded-md w-full text-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute right-3 top-3 text-black">
                  <FaSearch />
                </span>
              </div>
              <select
                className="px-4 py-2 bg-backgroundgray text-black rounded-full w-full sm:w-60 border-none focus:ring-0 focus:border-none text-sm"
                onChange={(e) => {
                  if (e.target.value === 'Most Attestations') {
                    const sorted = [...contributions].sort((a, b) => {
                        const countA = ( a ).attestationCount ?? 0;
                        const countB = ( b ).attestationCount ?? 0;
                        return countB - countA;
                      });
                    setContributions(sorted);
                  }
                }}
              >
                <option>Sort by: Most Attestations</option>
              </select>
            </div>
            <div className="mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
              {filteredContributions.map((contribution) => (
                <Link
                  href={`/projects/${project.projectName}/contributions/${contribution.id}`}
                  key={contribution.id}
                >
                  <div
                    className="flex flex-col justify-between p-2 sm:p-2 border bg-white text-black border-gray-300 rounded-lg w-full h-56 shadow-lg"
                  >
                    <div className="flex-grow overflow-hidden">
                      <h3 className="text-xl sm:text-lg font-semibold pb-2">
                        {contribution.contribution}
                      </h3>
                      <p className="text-gray-500 text-md sm:text-base overflow-hidden overflow-ellipsis">
                        {contribution.desc}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Attestations: {contribution.attestationCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <button className="btn w-2/3">View Contribution</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      case 'insights':
        return (
          <div className="text-black text-left">
            <h3 className="font-semibold mb-4">Insights</h3>
            {recentAttestationsLoading ? (
              <p>Loading...</p>
            ) : recentAttestations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
                {recentAttestations.map((attestation, index) => {
                  const attestationLink = `${easScanEndpoints[
                    project.ecosystem as AttestationNetworkType
                  ]}${attestation.attestationUID}`;
                  return (
                    <div
                      key={index}
                      className="p-4 bg-white border rounded-lg shadow-md"
                      onClick={() => handleAttestationClick(attestation)}
                    >
                      <div className="flex items-start mb-2">
                        {attestation.pfp && (
                          <Image
                            src={attestation.pfp}
                            alt={attestation.username}
                            width={40}
                            height={40}
                            className="mr-2 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">
                            {attestation.username}
                          </h3>
                          {renderAttestationContent(attestation)}
                          <p className="text-sm text-gray-500">
                            {format(
                              new Date(attestation.createdAt || ''),
                              'MMMM dd, yyyy'
                            )}
                          </p>
                          {/* <Link href={attestationLink}>
                              <p className='text-black hover:underline'>View Attestation</p>
                            </Link> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No attestations yet.</p>
            )}
          </div>
        );

      case 'charts':
        return <div className="text-black">Content for Charts, coming soon!</div>;
      default:
        return <div className="text-black">Select a tab</div>;
    }
  };

  return (
    <main className="flex-grow relative p-8 sm:p-10 bg-backgroundgray w-full h-full">
      {/* Add contribution button */}
      {user.fid === project.userFid && (
        <div className="absolute top-1.5 right-5">
          <button
            style={{
              height: isMobile ? '15px' : '40px',
              width: isMobile ? '75px' : '150px',
              fontSize: isMobile ? '10px' : '16px',
            }}
            className="btn bg-headerblack text-white hover:bg-gray-200 hover:text-black"
            onClick={() => setModalOpen(true)}
          >
            Add Contribution
          </button>
          <AddContributionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            addContribution={addContribution}
            addContributionCallback={handleContributionAdded}
          />
        </div>
      )}

      <div className="mb-4 border-b border-gray-200 mt-4 sm:mt-8">
        <nav className="flex space-x-4 text-black">
          <button
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <IoIosMenu className="h-6 w-6" />
          </button>

          <button
            className=""
            onClick={() => router.push('/searchProject')}
            aria-label="Go Back"
          >
            <IoIosArrowBack className="h-6 w-6" />
          </button>

          <button
            onClick={() => setActiveTab('contributions')}
            className={tabClasses('contributions')}
          >
            Contributions
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={tabClasses('insights')}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={tabClasses('charts')}
          >
            Charts
          </button>
        </nav>
      </div>

      <div className="flex">
        <div
          className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        ></div>
        <div
          className={`fixed inset-y-0 left-0 z-40 bg-white transform transition-transform duration-300 ease-in-out w-70 md:w-70 lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar project={project} projectAttestationCount={projectAttestationCount} />
        </div>

        <div className="flex-1 p-4">{renderContent()}</div>
      </div>
      <AttestationModalView
        attestation={selectedAttestation}
        isOpen={isAttestationModalOpen}
        onClose={() => setIsAttestationModalOpen(false)}
        />
    </main>
  );
}
