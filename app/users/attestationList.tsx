// app/users/attestationList.tsx

import React from 'react';
import { getAttestationsByUserId, getProjectsByUserId } from '@/src/lib/db';
import { Attestation, AttestationNetworkType, Project } from '@/src/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { easScanEndpoints } from '../components/easScan';


interface Props {
  userFid: string;
}

const AttestationList = async ({ userFid }: Props) => {
  try {
    let attestations: Attestation[] = await getAttestationsByUserId(userFid);
    let projects: Project[] = await getProjectsByUserId(userFid);

    // Sort attestations by createdAt timestamp in descending order
    attestations.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

    //extract the project names and ecosystems
    const userProjects = [...new Set(projects.map((project) => project.projectName))]
    const userEcosystems = [...new Set(projects.map((project) => project.ecosystem))]

    // Extract unique project names and ecosystems
    const attestedProjectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
    const attestedEcosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];

    // Combine ecosystems from attestations and created projects
    const ecosystemsOfInterest = [...new Set([...attestedEcosystems, ...userEcosystems])];


    return (
      <div className='bg-white text-black'>
        {attestations.length || projects.length > 0 ? (
          <div>
            <div>
            {attestedProjectNames.length > 0 ? (
              <div>
              <h3 className='mt-4'>Projects Attested To:</h3>
                <ul>
                  {attestedProjectNames.map((projectName) => (
                    <li key={projectName}>
                      <Link href={`/projects/${projectName}`}>
                      {projectName}
                      </Link>
                      </li>
                  ))}
                </ul>
              </div>
              ) : (
                <p></p>
              )}
            </div>
            <div className='mt-4'>
              <h3>Ecosystems of Interest:</h3>
              {ecosystemsOfInterest.length > 0 ? (
                <ul>
                  {ecosystemsOfInterest.map((ecosystem) => (
                    <li key={ecosystem}>{ecosystem}</li>
                  ))}
                </ul>
              ) : (
                <p>No ecosystems of interest.</p>
              )}
            </div>
            {/*include the projects they have created */}
            <div className='mt-4'>
              <h3>Projects Created:</h3>
              {userProjects.length > 0 ? (
              <ul>
                {userProjects.map((projectName) => (
                  <li key={projectName}>
                    <Link href={`/projects/${projectName}`}>
                      <p className='text-black hover:underline'>{projectName}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects created.</p>
            )}
            </div>

            <div className='mt-4'>
              <h3>Attestation Details:</h3>
              {attestations.map((attestation) => (
                <div key={attestation.id} className='mt-4'>
                  <ul className='mt-2'>
                    <li className='mb-4'>
                      <div className='flex justify-between items-center'>
                        <div>
                          <Link href={`/projects/${attestation.projectName}`}>
                            <p className='text-black hover:underline'>Project Name: {attestation.projectName}</p>
                          </Link>
                          <p>Contribution: {attestation.contribution}</p>
                          <Link href={`${easScanEndpoints[attestation.ecosystem as AttestationNetworkType]}${attestation.attestationUID}`}> 
                            <p className='text-black hover:underline'>Attestation UID: {attestation.attestationUID}</p>
                          </Link>
                          <p>Attestation Type: {attestation.attestationType}</p>
                          <p>Feedback: {attestation.feedback}</p>
                        </div>
                        <div>
                          <span className='text-sm text-gray-600'>
                            {formatDistanceToNow(new Date(attestation.createdAt || ''), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No projects attested to</p>
        )}
      
    </div>
    );
  } catch (error) {
    console.error('Failed to fetch attestations:', error);
    // Handle the error, display an error message, or return a fallback UI
    return <p>Failed to fetch attestations. Please try again later.</p>;
  }
};

export default AttestationList;