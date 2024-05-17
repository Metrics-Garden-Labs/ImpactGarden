import React from 'react';
import { getUserByUsername, getUserAddressesByFid, getAttestationsByUserId, getProjectsByUserId, getUserProjectAttestations } from '../../src/lib/db';
import { Attestation, Project, User } from '../../src/types';
import Navbar from '../components/navbar1';
import AttestationList from './attestationList';
import { getAttestationsByCoinbaseVerified } from '../..//src/utils/coinbaseVerified';
import { checkOpBadgeholder } from '../..//src/utils/opBadgeholder';
import { NetworkType, networkEndpoints } from '../components/graphqlEndpoints';
import { getAddress } from 'viem';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import Image from 'next/image';
import { totalmem } from 'os';
import Link from 'next/link';

interface Props {
  user: User;
}

const UserHeader = async ({ user }: Props) => {
  // The number of attestations they have given to other projects
  let attestations: Attestation[] = await getAttestationsByUserId(user.fid);
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

  // Fetch the user addresses and verification statuses from the database
  const user_addresses = await getUserAddressesByFid(user.fid);

  // Extract individual verification statuses
  const isCoinbaseVerified = user_addresses.some(address => address.coinbaseverified);
  console.log('isCoinbaseVerified', isCoinbaseVerified);
  const isOpBadgeholder = user_addresses.some(address => address.opbadgeholder);
  console.log('isOpBadgeholder', isOpBadgeholder);
  const isPowerBadgeholder = user_addresses.some(address => address.powerbadgeholder);
  console.log('isPowerBadgeholder', isPowerBadgeholder);

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
              <span className="ml-2 flex items-center">
              <span
                className={`tooltip ${isCoinbaseVerified ? 'text-black' : 'text-gray-400'} mr-1`}
                data-tip="Coinbase Wallet Verified"
              >
                {isCoinbaseVerified && (
                  <Image
                    src="/coinbaseWallet.png"
                    alt="Coinbase Wallet Verified"
                    width={25}
                    height={25}
                  />
                )}
              </span>
                <span
                  className={`tooltip text-sm ${isOpBadgeholder ? 'text-black ' : 'text-gray-400'} mr-1`}
                  data-tip="Optimism Badgeholder"
                >
                  {isOpBadgeholder && (
                    <Image
                      src="/opLogo.png"
                      alt="OP Badge"
                      width={20}
                      height={20}
                    />
                  )}
                </span>
                <span
                  className={`tooltip text-sm ${isPowerBadgeholder ? 'text-black' : 'text-gray-400'}`}
                  data-tip="Power User Badge"
                >
                  {isPowerBadgeholder && (
                    <Image
                      src="/powerBadge.png"
                      alt="Power User Badge"
                      width={20}
                      height={20}
                    />
                  )}
                </span>
              </span>
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
