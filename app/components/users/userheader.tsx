import React from 'react';
import { getUserByUsername, getUserAddressesByFid, getUserProjectAttestations } from '@/src/lib/db/dbusers';
import { getProjectsByUserId } from '@/src/lib/db/dbprojects';
import { getAttestationsByUserId } from '@/src/lib/db/dbattestations';
import { Attestation, Attestation2, Attestation4, Project, User } from '@/src/types';
import Image from 'next/image';
import { getUserBadgeStatus } from '@/src/utils/badges/badgeHelper';
import {BadgeDisplay} from '@/app/components/ui/BadgeDisplay';

interface Props {
  user: User;
}

const UserHeader = async ({ user }: Props) => {
  // The number of attestations they have given to other projects
  let attestations: Attestation4[] = await getAttestationsByUserId(user.fid);
  // The names of these projects
  const attestedProjectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
  // Their ecosystems
  const attestedEcosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];

  // The number of projects a user has created
  let projects: Project[] = await getProjectsByUserId(user.fid);
  const userProjectsNames = [...new Set(projects.map((project) => project.projectName))];
  const userEcosystems = [...new Set(projects.map((project) => project.ecosystem))];

  let projectAttestations: Attestation[] = [];
  // This will be the number of attestations their projects have received
  if (userProjectsNames.length > 0) {
    projectAttestations = await getUserProjectAttestations(userProjectsNames);
    console.log('projectAttestations:', projectAttestations);
  }

  // Total attestations
  const totalAttestations = attestations.length + (projectAttestations?.length || 0);

  // Combine ecosystems from attestations and created projects for ecosystems of interest
  const ecosystemsOfInterest = [...new Set([...attestedEcosystems, ...userEcosystems])];

  // Fetch the user badge statuses using the helper function
  const { 
    isCoinbaseVerified, 
    isOpBadgeholder, 
    isPowerBadgeholder, 
    isDelegate, 
    s4Participant 
  } = await getUserBadgeStatus(user.fid);



  return (
    <div className='bg-gray-50 pb-8'>
      <div className="flex flex-col items-center sm:flex-row sm:items-end justify-between mb-8 bg-gray-50 px-4 sm:px-8 md:px-12 pt-20 sm:pt-28 md:pt-32">
        <div className="flex flex-col items-center sm:flex-row sm:items-end space-x-0 sm:space-x-6 mb-6 sm:mb-0">
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            <Image
              src={user.pfp_url || ''}
              alt={user.username}
              className="rounded-md max-w-48 max-h-48"
              width={200}
              height={200}
            />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex items-center">
              {user.username}
              <div className="mt-2">
                <BadgeDisplay
                  isCoinbaseVerified={isCoinbaseVerified}
                isOpBadgeholder={isOpBadgeholder}
                  isPowerBadgeholder={isPowerBadgeholder}
                  isDelegate={isDelegate}
                  s4Participant={s4Participant}
                />
              </div>
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-3   gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow text-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-left">{totalAttestations}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-light text-left">TOTAL REVIEWS</p>
          </div>
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow text-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-left">{attestations.length}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-light text-left">REVIEWS GIVEN</p>
          </div>
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow text-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-left">{projectAttestations.length}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-light text-left">REVIEWS RECEIVED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;

//redeploy