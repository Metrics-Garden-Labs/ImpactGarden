// src/components/ContributionPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { AttestationNetworkType, Contribution, AttestationDisplay, Project, GovInfraAndToolingDisplay } from '@/src/types'; 
import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";
import { FaCopy } from 'react-icons/fa';
import AttestationModal2 from '../../AttestationModal2';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import Link from 'next/link';
import { format } from 'date-fns';
import { easScanEndpoints } from '../../../../src/utils/easScan';
import Image from 'next/image';
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
  const [activeTab, setActiveTab] = useState('details');
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

  const tabClasses = (tabName: string) =>
    `cursor-pointer px-4 py-2 text-sm font-semibold mr-2 ${
      activeTab === tabName ? 'border-b-2 border-black' : 'text-gray-600 hover:text-black'
    }`;

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
            onClick={() => router.back()}
            aria-label="Go Back"
          >
            <IoIosArrowBack className="h-6 w-6" />
          </button>
          <button onClick={() => setActiveTab('details')} className={tabClasses('details')}>
            Contribution Details
          </button>
          <button onClick={() => setActiveTab('attestations')} className={tabClasses('attestations')}>
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
          attestationCount={attestationCount}
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
