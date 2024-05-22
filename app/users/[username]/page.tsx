// app/users/[username].tsx

import React from 'react';
import { getUserByUsername, getUserAddressesByFid } from '../../../src/lib/db';
import { User } from '../../../src/types';
import Navbar from '../../components/navbar1';
import UserHeader from '../userheader';
import AttestationList from '../attestationList';

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

        <UserHeader user={user} />
        <div className="container mx-auto px-4 py-8">
          <div>
            <AttestationList user={user} />
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
