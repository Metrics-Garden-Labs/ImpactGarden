// app/users/attestationList.tsx

import React from 'react';
import { getAttestationsByUserId } from '@/src/lib/db';
import { Attestation, AttestationNetworkType } from '@/src/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { easScanEndpoints } from '../components/easScan';


interface Props {
  userFid: string;
}

const AttestationList = async ({ userFid }: Props) => {
  try {
    let attestations: Attestation[] = await getAttestationsByUserId(userFid);

    // Sort attestations by createdAt timestamp in descending order
    attestations.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

    // Extract unique project names and ecosystems
    const projectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
    const ecosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];
    console.log('attestations', attestations);
    console.log('projectNames', projectNames);
    console.log('ecosystems', ecosystems);
    return (
      <div className='bg-white text-black'>
        {attestations.length > 0 ? (
          <div>
            <div>
              <h3 className='mt-4'>Projects Attested To:</h3>
              {projectNames.length > 0 ? (
                <ul>
                  {projectNames.map((projectName) => (
                    <li key={projectName}>
                      <Link href={`/projects/${projectName}`}>
                      {projectName}
                      </Link>
                      </li>
                  ))}
                </ul>
              ) : (
                <p>No projects attested to.</p>
              )}
            </div>
            <div className='mt-4'>
              <h3>Ecosystems of Interest:</h3>
              {ecosystems.length > 0 ? (
                <ul>
                  {ecosystems.map((ecosystem) => (
                    <li key={ecosystem}>{ecosystem}</li>
                  ))}
                </ul>
              ) : (
                <p>No ecosystems of interest.</p>
              )}
            </div>
            <div className='mt-4'>
              <h3>Attestation Details:</h3>
              <ul className='mt-2'>
                {attestations.map((attestation) => (
                  <li key={attestation.id} className='mb-4'>
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
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No attestations found for this user.</p>
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