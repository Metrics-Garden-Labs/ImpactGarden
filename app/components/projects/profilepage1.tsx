'use client';

import React, { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosMenu } from "react-icons/io";
import { Project, ContributionWithAttestationCount, AttestationDisplay, Contribution } from '@/src/types';
import AddContributionModal from './addContributionModal';
import { useGlobalState } from '@/src/config/config';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import useLocalStorage from '@/src/hooks/use-local-storage-state';
import Sidebar from '@/app/components/projects/smSidebar';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';
import AttestationModalView from '../attestations/AttestationModalView';
import DisplayContributions from '../contributions/DisplayContirbutions';
import ContributionAttestations from '../contributions/ContributionAttestations';
import useContributionData from '@/src/hooks/useContributionData';
import { zeroAddress } from 'viem';
// import useChainSwitcher from '@/src/hooks/useChainSwitcher';

import { useParams } from 'next/navigation';

interface ProfilePageProps {
  contributions: Contribution[];
  project: Project;
  projectAttestationCount: number;
  categories: string[];
  subcategories: string[];
}

export default function ProfilePage({ 
  contributions: initialContributions, 
  project, 
  projectAttestationCount,
  categories,
  subcategories,
}: ProfilePageProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'insights' || tabParam === 'charts' ? tabParam : 'contributions';
  });
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

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const projectName = params.projectName as string;
  const contributioneasUid = params.contributioneasUid as string;

  // useChainSwitcher(project);

  useEffect(() => {
    console.log('Contribution UID from URL path:', contributioneasUid);
    if (contributioneasUid && contributions.length > 0) {
      const contribution = contributions.find(c => c.easUid === contributioneasUid);
      if (contribution) {
        setSelectedContribution(contribution);
        console.log('Selected Contribution:', contribution);
      } else {
        console.error('Contribution not found');
      }
    }
  }, [params, contributions]);
  
  

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'insights' || tabParam === 'charts' || tabParam === 'contributions') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`);
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
      ethAddress: user.ethAddress || zeroAddress,
      attestationCount: 0,
    };

    setContributionCards((prevContributions) => [...prevContributions, addedContribution]);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/searchProject');
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
            onClick={handleBackClick}
            aria-label="Go Back"
          >
            <IoIosArrowBack className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleTabChange('contributions')}
            className={tabClasses('contributions')}
          >
            Contributions
          </button>
          <button
            onClick={() => handleTabChange('insights')}
            className={tabClasses('insights')}
          >
            Insights
          </button>
          <button
            onClick={() => handleTabChange('charts')}
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
          <Sidebar 
            project={project} 
            projectAttestationCount={projectAttestationCount} 
            categories={categories}
            subcategories={subcategories}
          />
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