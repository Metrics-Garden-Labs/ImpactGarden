

import React from 'react';
import { getUserByUsername, getUserAddressesByFid, getAttestationsByUserId, getProjectsByUserId, getUserProjectAttestations,   } from '../../src/lib/db';
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



const UserHeader = async ({ user}: Props) => {

    //the number of attestations they have given to other projects
    let attestations: Attestation[] = await getAttestationsByUserId(user.fid);
    //the names of these projects
    const attestedProjectNames = [...new Set(attestations.map((attestation) => attestation.projectName))];
    //their ecosystems
    const attestedEcosystems = [...new Set(attestations.map((attestation) => attestation.ecosystem))];


    //the number of projects a user has created
    let projects: Project[] = await getProjectsByUserId(user.fid);
    const userProjectsNames = [...new Set(projects.map((project) => project.projectName))]
    const userEcosystems = [...new Set(projects.map((project) => project.ecosystem))]

    let projectAttestations: Attestation[] = [];
    //this will be the number of attestations their projcts have received
    if (userProjectsNames.length > 0) {
        let projectAttestations: Attestation[] = await getUserProjectAttestations(userProjectsNames);
        console.log('projectAttestations:', projectAttestations);
    }
 
    //total attestations
    const totalAttestations = attestations.length + projectAttestations?.length;

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
  <div className="flex items-end justify-between mb-8 bg-gray-50 px-16 pt-40">
    <div className="flex items-end space-x-6">
      <div className="flex-shrink-0">
        <Image
          src={user.pfp_url || ''}
          alt={user.username}
          className="rounded-md max-w-48 max-h-48"
          width={200}
          height={200}
        />
      </div>
      <div>
        <h1 className="text-5xl font-bold text-gray-900 flex pl-6 items-center">
          {user.username}
          <span className="ml-2 flex items-center">
            <span className={`text-sm ${isCoinbaseVerified ? 'text-green-500' : 'text-gray-400'} mr-1`}>
              {isCoinbaseVerified && (
                <Image src="/coinbaseWallet.png" alt="Coinbase Wallet Verified" width={25} height={25} />
              )}
            </span>
            <span className={`text-sm ${isOpBadgeholder ? 'text-green-500' : 'text-gray-400'} mr-1`}>
              {isOpBadgeholder && <Image src="/opLogo.png" alt="OP Badge" width={20} height={20} />}
            </span>
            <span className={`text-sm ${isPowerBadgeholder ? 'text-green-500' : 'text-gray-400'}`}>
              {isPowerBadgeholder && <Image src="/powerBadge.png" alt="Power User Badge" width={20} height={20} />}
            </span>
          </span>
        </h1>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-4xl font-bold text-left">{totalAttestations}</p>
      <p className="text-sm text-gray-500 font-light text-left">TOTAL REVIEWS</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-4xl font-bold text-left">{attestations.length}</p>
        <p className="text-sm text-gray-500 font-light text-left">REVIEWS GIVEN</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-4xl font-bold text-left">{projectAttestations.length}</p>
        <p className="text-sm text-gray-500 font-light text-left">REVIEWS RECEIVED</p>
      </div>
    </div>
  </div>


  </div>
       
      );
    };

export default UserHeader;