'use client';

import React, { useEffect, useState } from 'react';
import { AttestationNetworkType, Contribution, ContributionAttestationWithUsername, Project } from '@/src/types'; 
import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack } from "react-icons/io";
import { FaCopy } from 'react-icons/fa';
import AttestationModal from '../../AttestationModal';
import { NEXT_PUBLIC_URL } from '@/src/config/config';
import Link from 'next/link';
import { format } from 'date-fns';
import { easScanEndpoints } from '../../../components/easScan';
import Image from 'next/image';

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
  const [recentAttestations, setRecentAttestations] = useState<ContributionAttestationWithUsername[]>([]);
  const [recentAttestationsLoading, setRecentAttestationsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchRecentAttestations = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/getContributionAttestations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contribution: contribution.contribution }),
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

  useEffect(() => {
    if (activeTab === 'attestations') {
      fetchRecentAttestations();
    }
  }, [activeTab]);

  const tabClasses = (tabName: string) =>
    `cursor-pointer px-4 py-2 text-sm font-semibold mr-2 ${
      activeTab === tabName ? 'border-b-2 border-black' : 'text-gray-600 hover:text-black'
    }`;

  const isWebShareSupported = !!navigator.share;
  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}${pathname}?contribution=${contribution.id}`;
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
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <>
            <div className="text-left pt-8 p-2">
              <h2 className="text-xl font-bold mb-4">
                {contribution.contribution}
              </h2>
            </div>
            <hr className="border-1 border-gray-300 my-2 mx-auto w-1/2" />
            <div className="mb-4 items-left py-3 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-left">Description</h3>
              <p className="text-left">{contribution.desc}</p>
            </div>
            {contribution.link && (
              <div className="mb-4 justify-start items-center overflow-y-auto">
                <h3 className="font-semibold text-left">Link/Evidence</h3>
                <div className="flex justify-start items-center">
                  <a
                    href={contribution.link || ""}
                    className="text-gray-500 hover:text-gray-300 visited:text-indigo-600 flex items-center"
                  >
                    <p className='text-left'>{contribution.link}</p>
                  </a>
                </div>
              </div>
            )}
            <div className="flex justify-start mt-2">
              <button 
                className="btn bg-headerblack text-white hover:bg-gray-200 items-center justify-center hover:text-black px-2 py-1"
                onClick={() => setIsAttestationModalOpen(true)}
              >
                Endorse
              </button>
              <button
                className="btn text-center bg-headerblack text-white hover:bg-blue-500 ml-2"
                onClick={copyToClipboard}
              >
                Share<FaCopy className="ml-1" />
              </button>
            </div>
          </>
        );
      case 'attestations':
        return (
          <div className="text-black text-left">
            <h3 className="font-semibold mb-4">Attestations</h3>
            {recentAttestationsLoading ? (
              <p>Loading...</p>
            ) : recentAttestations.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto'>
                {recentAttestations.map((attestation, index) => {
                  const attestationLink = `${easScanEndpoints[contribution.ecosystem as AttestationNetworkType]}${attestation.attestationUID}`;
                  return (
                    <div key={index} className='p-4 bg-white border rounded-lg shadow-md'>
                      <div className='flex items-start mb-2'>
                        {attestation.pfp && (
                          <Image
                            src={attestation.pfp}
                            alt={attestation.username}
                            width={40}
                            height={40}
                            className='mr-2 rounded-full'
                          />
                        )}
                        <div>
                          <h3 className='text-lg font-semibold'>{attestation.username}</h3>
                          <p className='text-sm text-gray-500'>Rating: {attestation.rating} </p>
                          <p className='text-sm text-gray-500 mb-2'>{attestation.feedback}</p>
                          <p className='text-sm text-gray-500'>
                            {format(new Date(attestation.createdAt || ''), 'MMMM dd, yyyy')}
                          </p>
                          <Link href={attestationLink}>
                            <p className='text-black hover:underline'>View Attestation</p>
                          </Link>
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
            Attestations
          </button>
        </nav>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 p-4">
          {renderContent()}
        </div>
      </div>
      {isAttestationModalOpen && (
        <AttestationModal
          contribution={contribution}
          project={project}
          attestationCount={attestationCount}
          onClose={() => setIsAttestationModalOpen(false)}
          isOpen={isAttestationModalOpen}
        />
      )}
    </main>
  );
}
