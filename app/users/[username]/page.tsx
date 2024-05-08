// // app/users/[username].tsx

import React from 'react';
import { getUserByUsername, getUserAddressesByFid  } from '../../../src/lib/db';
import { User } from '../../../src/types';
import Navbar from '../../components/navbar1';
import AttestationList from '../attestationList';
import { getAttestationsByCoinbaseVerified } from '../../..//src/utils/coinbaseVerified';
import { checkOpBadgeholder } from '../../..//src/utils/opBadgeholder';
import { NetworkType, networkEndpoints } from '../../components/graphqlEndpoints';
import { getAddress } from 'viem';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import Image from 'next/image';
import UserHeader from '../userheader';

interface Props {
  params: {
    username: string;
  };
}

const UserProfilePage = async ({ params }: Props) => {
  const { username } = params;

  try {
    // Fetch the basic user info
    const user: User | null = await getUserByUsername(username);
    if (!user) {
      return (
        <div className='bg-white text-black'>
          <Navbar />
          <h1>User not found</h1>
        </div>
      );
    }

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
      <div className="bg-white min-h-screen text-black">
        <Navbar />
        <UserHeader user={user} />
        <div className="container mx-auto px-4 py-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Activity</h2>
            <AttestationList userFid={user.fid} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return (
      <div className='bg-white text-black'>
        <Navbar />
        <h1>User Profile</h1>
        <p>Failed to fetch user. Please try again later.</p>
      </div>
    );
  }
};

export default UserProfilePage;


