// src/components/ContributionPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Contribution, AttestationDisplay, Project } from '@/src/types'; 
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";
import AttestationModal2 from '../projects/AttestationModal2';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import AttestationModalView from '@/app/components/attestations/AttestationModalView';
import AttestationCard from '@/app/components/attestations/AttestationCard';
import ContributionDetails from '@/app/components/contributions/ContributionDetails';





interface ContributionPageProps {
  contribution: Contribution;
  project: Project;
  attestationCount: number;
}

export default function ContributionPage({ 
  contribution, 
  project,
  attestationCount
}: ContributionPageProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'attestations' ? tabParam : 'details';
  });
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [recentAttestations, setRecentAttestations] = useState<AttestationDisplay[]>([]);
  const [recentAttestationsLoading, setRecentAttestationsLoading] = useState(true);
  const [selectedAttestation, setSelectedAttestation] = useState<AttestationDisplay | null>(null);
  const [isAttestationViewModalOpen, setIsAttestationViewModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();


  const fetchRecentAttestations = async () => {
    try {
      console.log('Fetching attestations for:', contribution);
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/getContributionAttestations2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contribution: contribution.contribution, category: contribution.category, subcategory: contribution.subcategory }),
      });
      console.log('Fetching attestations for:', contribution);

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

  useEffect(() => {
    if (activeTab === 'attestations') {
      fetchRecentAttestations();
    }
  }, [activeTab]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'details' || tabParam === 'attestations') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const tabClasses = (tabName: string) =>
    `cursor-pointer px-4 py-2 text-sm font-semibold mr-2 ${
      activeTab === tabName ? 'border-b-2 border-black' : 'text-gray-600 hover:text-black'
    }`;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.back();
  };
  const isWebShareSupported = typeof navigator !== 'undefined' && !!navigator.share;
  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}${pathname}?contribution=${contribution.id}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Link copied to clipboard!');
          if (isWebShareSupported) {
            return navigator.share({
              title: 'Share Contribution Link',
              text: 'Check out this contribution:',
              url: shareUrl,
            });
          }
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleMakeFrame = () => {
    router.push(`/makeFrame/${contribution.id}`);
  };


  const handleAttestationClick = (attestation: AttestationDisplay) => {
    setSelectedAttestation(attestation);
    setIsAttestationViewModalOpen(true);
  };
  

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <ContributionDetails
          contribution={contribution}
          project={project}
          setIsAttestationModalOpen={setIsAttestationModalOpen}
          copyToClipboard={copyToClipboard}
        />
        );
      case 'attestations':
        return (
          <AttestationCard
            contribution={contribution}
            fetchRecentAttestations={fetchRecentAttestations}
            recentAttestations={recentAttestations}
            recentAttestationsLoading={recentAttestationsLoading}
            handleAttestationClick={handleAttestationClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-grow relative p-8 sm:p-10 bg-backgroundgray w-full h-full">
      <div className="mb-4 border-b border-gray-200 mt-4 sm:mt-8">
        <nav className="flex space-x-4 text-black">
          <button
            className=""
            onClick={handleBackClick}
            aria-label="Go Back"
          >
            <IoIosArrowBack className="h-6 w-6" />
          </button>
          <button onClick={() => handleTabChange('details')} className={tabClasses('details')}>
            Contribution Details
          </button>
          <button onClick={() => handleTabChange('attestations')} className={tabClasses('attestations')}>
            Insights
          </button>
        </nav>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 p-4">
          {renderContent()}
        </div>
      </div>
      {isAttestationModalOpen && (
        <AttestationModal2
          contribution={contribution}
          project={project}
          onClose={() => setIsAttestationModalOpen(false)}
          isOpen={isAttestationModalOpen}
        />
      )}
      <AttestationModalView
        attestation={selectedAttestation}
        isOpen={isAttestationViewModalOpen}
        onClose={() => setIsAttestationViewModalOpen(false)}
      />
    </main>
  );
}
