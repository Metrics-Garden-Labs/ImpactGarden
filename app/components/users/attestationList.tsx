'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import AttestationModalView from '@/app/components/attestations/AttestationModalView';
import { Attestation2, User, Project } from '@/src/types';
import { NEXT_PUBLIC_URL } from '@/src/config/config';

interface Props {
  user: User;
}

const AttestationList = ({ user }: Props) => {
  const [attestations, setAttestations] = useState<Attestation2[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectUidMap, setProjectUidMap] = useState<Record<string, string>>({});
  const [selectedAttestation, setSelectedAttestation] = useState<Attestation2 | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data (attestations and projects)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_URL}/api/getUserData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fid: user.fid }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setAttestations(data.attestations);
        setProjects(data.projects);
      } catch (err) {
        setError('Failed to load user data. Please try again later.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.fid]);

  // Fetch project UIDs after attestations are loaded
  useEffect(() => {
    if (attestations.length > 0) {
      const fetchProjectUids = async () => {
        try {
          const projectNames = [...new Set(attestations.map((att) => att.projectName))];

          const response = await fetch(`${NEXT_PUBLIC_URL}/api/getProjectsByUid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectNames }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch project UIDs');
          }

          const data = await response.json();
          setProjectUidMap(data.projectUidMap);
        } catch (err) {
          setError('Failed to load project UIDs. Please try again later.');
          console.error('Error fetching project UIDs:', err);
        }
      };

      fetchProjectUids();
    }
  }, [attestations]);

  const openModal = (attestation: Attestation2) => {
    setSelectedAttestation(attestation);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  // Sort attestations by createdAt timestamp in descending order
  attestations.sort(
    (a, b) =>
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  // Extract unique project names and ecosystems
  const attestedProjectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
  const attestedEcosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];
  const userEcosystems = [...new Set(projects.map((project) => project.ecosystem))];
  const ecosystemsOfInterest = [...new Set([...attestedEcosystems, ...userEcosystems])];

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='w-full md:w-1/3 lg:w-1/4 p-4 bg-white border-b md:border-b-0 md:border-r'>
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-2'>Projects Attested to:</h3>
          {attestedProjectNames.length > 0 ? (
            <ul>
              {attestedProjectNames.map((projectName) => (
                <li key={projectName} className='mb-2'>
                  {projectUidMap[projectName] ? (
                    <Link href={`/projects/${projectUidMap[projectName]}`}>
                      <p className='text-black hover:underline'>{projectName}</p>
                    </Link>
                  ) : (
                    <p className='text-black'>{projectName}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects attested to.</p>
          )}
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-2'>Ecosystem of Interest:</h3>
          {ecosystemsOfInterest.length > 0 ? (
            <ul>
              {ecosystemsOfInterest.map((ecosystem) => (
                <li key={ecosystem} className='mb-2'>
                  {ecosystem}
                </li>
              ))}
            </ul>
          ) : (
            <p>No ecosystems of interest.</p>
          )}
        </div>
      </div>
      <div className='w-full md:w-2/3 lg:w-3/4 p-4'>
        <h2 className='text-2xl font-bold mb-4'>Reviews {user.username} has given</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 lg:gap-8 max-w-6xl overflow-y-auto'>
          {attestations.length > 0 ? (
            attestations.map((attestation) => (
              <div
                key={attestation.id}
                className='p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:bg-[#F4D3C3]/20 cursor-pointer overflow-hidden'
                onClick={() => openModal(attestation)}
              >
                <div className='flex flex-col p-6'>
                  <div className='flex items-start mb-2'>
                    {attestation.logoUrl && (
                      <Image
                        src={attestation.logoUrl}
                        alt={attestation.projectName || ''}
                        width={50}
                        height={50}
                        className='mr-4 flex-shrink-0'
                      />
                    )}
                    <div className='min-w-0 flex-1'>
                      <h3 className='text-lg font-semibold truncate'>{attestation.projectName}</h3>
                      <p className='text-sm text-gray-500 truncate'>{attestation.contribution}</p>
                      {attestation.subcategory && (
                        <p className='text-sm text-gray-500 truncate'>{attestation.subcategory}</p>
                      )}
                    </div>
                  </div>
                  <p className='text-gray-700 mb-2 pt-4 line-clamp-5 overflow-hidden'>
                    {attestation.feedback}
                  </p>
                  {attestation.rating && (
                    <p className='text-sm text-gray-500'>Rating: {attestation.rating}</p>
                  )}
                  <p className='text-sm pt-8 text-gray-500'>
                    {format(new Date(attestation.createdAt || ''), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews given.</p>
          )}
        </div>
      </div>
      <AttestationModalView
        attestation={selectedAttestation}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default AttestationList;
