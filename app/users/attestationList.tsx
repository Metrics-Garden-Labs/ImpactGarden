// app/users/attestationList.tsx

// app/users/attestationList.tsx

import React from 'react';
import { getAttestationsByUserId } from '../../src/lib/db';
import { Attestation } from '../../src/types';

interface Props {
  userFid: string;
}

const AttestationList = async ({ userFid }: Props) => {
  try {
    const attestations: Attestation[] = await getAttestationsByUserId(userFid);

    // Extract unique project names and ecosystems
    const projectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
    const ecosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];

    return (
      <div>
        <h2>Attestations:</h2>
        {attestations.length > 0 ? (
          <div>
            <div>
              <h3 className='mt-4'>Projects Attested To:</h3>
              {projectNames.length > 0 ? (
                <ul>
                  {projectNames.map((projectName) => (
                    <li key={projectName}>{projectName}</li>
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
                  <li key={attestation.id}>
                    <div className='mt-2'>
                      <p>Project Name: {attestation.projectName}</p>
                      <p>Contribution: {attestation.contribution}</p>
                      <p>Attestation UID: {attestation.attestationUID}</p>
                      <p>Attestation Type: {attestation.attestationType}</p>
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









// const AttestationList = async ({ userFid }: Props) => {
//   try {
//     const attestations: Attestation[] = await getAttestationsByUserId(userFid);

//     // Group attestations by project name
//     const groupedAttestations: Record<string, Attestation[]> = attestations.reduce((acc, attestation) => {
//       if (!acc[attestation.projectName]) {
//         acc[attestation.projectName] = [];
//       }
//       acc[attestation.projectName].push(attestation);
//       return acc;
//     }, {} as Record<string, Attestation[]>);

//     return (
//       <div>
//         <h2>Attestations:</h2>
//         {Object.keys(groupedAttestations).length > 0 ? (
//           <ul>
//             {Object.entries(groupedAttestations).map(([projectName, projectAttestations]) => (
//               <li key={projectName}>
//                 <h3>Project Name: {projectName}</h3>
//                 <ul>
//                   {projectAttestations.map((attestation) => (
//                     <li key={attestation.id}>
//                       <div>
//                         <p>Contribution: {attestation.contribution}</p>
//                         <p>Ecosystem: {attestation.ecosystem}</p>
//                         <p>Attestation Type: {attestation.attestationType}</p>
//                         <p>Created At: {attestation.createdAt?.toString()}</p>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No attestations found for this user.</p>
//         )}
//       </div>
//     );
//   } catch (error) {
//     console.error('Failed to fetch attestations:', error);
//     // Handle the error, display an error message, or return a fallback UI
//     return <p>Failed to fetch attestations. Please try again later.</p>;
//   }
// };

// export default AttestationList;