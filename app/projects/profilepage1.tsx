'use client';

import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { Project, Contribution, AttestationNetworkType } from '@/src/types';
import AddContributionModal from './addContributionModal';
import { useGlobalState } from '@/src/config/config';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import { getChainId } from '../components/networkContractAddresses';
import { useSwitchChain } from 'wagmi';
import AttestationModal from './AttestationModal';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Sidebar from './smSidebar';
import { useEAS } from '@/src/hooks/useEAS';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect'; // Import the hook

interface ProfilePageProps {
    contributions: Contribution[];
    project: Project;
    projectAttestationCount: number;
}

export default function ProfilePage({ 
    contributions, 
    project, 
    projectAttestationCount,
  }: ProfilePageProps) {
    console.log('Contributions in profile page:', contributions);
    const [activeTab, setActiveTab] = useState('attestations');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { eas } = useEAS();
    const [fid] = useGlobalState('fid');
    const [walletAddress] = useGlobalState('walletAddress');
    const [isUseful, setIsUseful] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [attestationCount, setAttestationCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { switchChain } = useSwitchChain();
    const [contributionCards, setContributionCards] = useState<Contribution[]>([]);
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
        const fetchContributions = async () => {
            if (project) {
                const res = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectContributions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ projectName: project.projectName }),
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
                setIsModalOpen(true);
            }
        }
    }, [searchParams, contributions]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleContributionAdded = (newContribution: string) => {
        const addedContribution: Contribution = {
            userFid: user.fid || '',
            projectName: project?.projectName || '',
            ecosystem: project?.ecosystem || '',
            governancetype: '',
            secondaryecosystem: '',
            contribution: newContribution,
            desc: '',
            link: '',
            easUid: '',
            ethAddress: walletAddress,
        };

        setContributionCards((prevContributions) => [...prevContributions, addedContribution]);
    };

    const tabClasses = (tabName: string) =>
        `cursor-pointer px-4 py-2 text-sm font-semibold mr-2 ${
            activeTab === tabName ? 'border-b-2 border-black' : 'text-gray-600 hover:text-black'
        }`;

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
                setContributionCards((prev) => [...prev, contribution]);
            }
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
        router.push(`${pathname}?contribution=${contribution.id}`);
    };

    const closeModal = () => {
        setSelectedContribution(null);
        setIsModalOpen(false);
        router.push(pathname);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'attestations':
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
                          <select className="px-4 py-2 bg-backgroundgray text-black rounded-full w-full sm:w-60 border-none focus:ring-0 focus:border-none text-sm">
                            <option>Sort by: Most Attestations</option>
                          </select>
                        </div>
                        <div className="mb-4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto">
                            {filteredContributions.map((contribution) => (
                                <div
                                    key={contribution.id}
                                    className="flex flex-col justify-between p-2 sm:p-2 border bg-white text-black border-gray-300 rounded-lg w-full h-56 shadow-lg"
                                    onClick={() => openmodal(contribution)}
                                >
                                    {/* updates to how the contribution data is displayed */}
                                    <div className="flex-grow overflow-hidden">
                                        <h3 className="text-xl sm:text-lg font-semibold pb-2">
                                            {contribution.contribution}
                                        </h3>
                                        <p className="text-gray-500 text-md sm:text-base overflow-hidden overflow-ellipsis">
                                            {contribution.desc}
                                        </p>
                                    </div>
                                    <div className="flex justify-center mt-2">
                                        <button className="btn bg-headerblack text-white hover:bg-gray-200 w-1/3 items-center justify-center hover:text-black px-2 py-1">
                                            Endorse
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'insights':
                return <div className="text-black">Content for Insights</div>;
            case 'charts':
                return <div className="text-black">Content for Charts</div>;
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

              <div className="flex-1 p-4">
                {renderContent()}
                {isModalOpen && selectedContribution && (
                  <AttestationModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    contribution={selectedContribution}
                    attestationCount={attestationCount}
                    project={project}
                    currentAddress={walletAddress}
                    eas={eas || null}
                  />
                )}
              </div>
            </div>
        </main>
    );
}
