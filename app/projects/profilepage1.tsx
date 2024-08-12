'use client';

import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosMenu } from "react-icons/io";
import { Project, ContributionWithAttestationCount, AttestationNetworkType, AttestationDisplay, Contribution, OnchainBuildersDisplay } from '@/src/types';
import AddContributionModal from './addContributionModal';
import { useGlobalState } from '@/src/config/config';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Sidebar from './smSidebar';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect'; // Import the hook
import AttestationModalView from '../components/attestations/AttestationModalView';
import DisplayContributions from '../components/contributions/DisplayContirbutions';
import ContributionAttestations from '../components/contributions/ContributionAttestations';
import useContributionData from '@/src/hooks/useContributionData';
import useChainSwitcher from '@/src/hooks/useChainSwitcher';


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
  const [walletAddress] = useGlobalState('walletAddress');
  const [contributionCards, setContributionCards] = useState<ContributionWithAttestationCount[]>([]);
  const { contributions, recentAttestations, recentAttestationsLoading } = useContributionData(project, activeTab);
  const [user] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
  });

  const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
  const pathname = usePathname(); // Use usePathname to get the current path
  const router = useRouter(); // Use useRouter for navigation

  useChainSwitcher(project);


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

  const handleAttestationClick = (attestation: AttestationDisplay) => {
    setSelectedAttestation(attestation);
    setIsAttestationModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'contributions':
        return (
          <DisplayContributions
          contributions={contributions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setContributions={()=>{}}
          project={project}
        />
        );
      case 'insights':
        return (
          <ContributionAttestations
            recentAttestations={recentAttestations}
            recentAttestationsLoading={recentAttestationsLoading}
            handleAttestationClick={handleAttestationClick}
            project={project}
          />
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
