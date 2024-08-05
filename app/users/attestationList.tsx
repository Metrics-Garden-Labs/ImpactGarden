'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import AttestationModalView from '../components/AttestationModalView';
import { Attestation2, User, Project } from '@/src/types';

interface Props {
  user: User;
}

const AttestationList = ({ user }: Props) => {
  const [attestations, setAttestations] = useState<Attestation2[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedAttestation, setSelectedAttestation] = useState<Attestation2 | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUserData', {
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
  attestations.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

  // Extract unique project names and ecosystems
  const userProjects = [...new Set(projects.map((project) => project.projectName))];
  const userEcosystems = [...new Set(projects.map((project) => project.ecosystem))];

  const attestedProjectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
  const attestedEcosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];

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
                  <Link href={`/projects/${projectName}`}>
                    <p className='text-black hover:underline'>{projectName}</p>
                  </Link>
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
                className='p-4 bg-white border rounded-lg shadow-md cursor-pointer'
                onClick={() => openModal(attestation)}
              >
                <div className='flex items-start mb-2'>
                  {attestation.logoUrl && (
                    <Image
                      src={attestation.logoUrl}
                      alt={attestation.projectName || ""}
                      width={40}
                      height={40}
                      className='mr-2 rounded-full'
                    />
                  )}
                  <div>
                    <h3 className='text-lg font-semibold'>{attestation.projectName}</h3>
                    <p className='text-sm text-gray-500'>{attestation.contribution}</p>
                    {attestation.subcategory && (
                      <p className='text-sm text-gray-500'>{attestation.subcategory}</p>
                    )}
                    <p className='text-gray-700 mb-2'>
                      {attestation.feedback} 
                    </p>
                    {attestation.rating && (
                      <p className='text-sm text-gray-500'>Rating: {attestation.rating}</p>
                    )}
                    <p className='text-sm text-gray-500'>
                      {format(new Date(attestation.createdAt || ''), 'MMMM dd, yyyy')}
                    </p>
                  </div>
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