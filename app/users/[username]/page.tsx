// app/users/[username].tsx

import React from 'react';
import { getUserByUsername } from '@/src/lib/db';
import { User } from '@/src/types';
import Navbar from '../../components/navbar';
import AttestationList from '../attestationList';
import { getAttestationsByCoinbaseVerified } from '@/src/utils/coinbaseVerified';
import { NetworkType, networkEndpoints } from '../../components/graphqlEndpoints';


interface Props {
  params: {
    username: string;
  };
}

const UserProfilePage = async ({ params }: Props) => {
  const { username } = params;


  try {
    const user: User | null = await getUserByUsername(username);

    if (!user) {
      return (
        <div>
          <Navbar />
          <h1>User not found</h1>
        </div>
      );
    }
    
    const coinbaseAddress = "0x357458739F90461b99789350868CD7CF330Dd7EE";
    const selectedNetwork: NetworkType = 'Base';
    const endpoint = networkEndpoints[selectedNetwork];
    console.log('endpoint', endpoint)
    console.log('ethaddress', user.ethaddress)
    const attestationData = await getAttestationsByCoinbaseVerified(coinbaseAddress, user.ethaddress || '', endpoint);
    console.log('attestationData', attestationData)
    const isVerified = attestationData && attestationData.length > 0;
    

    return (
      <div>
        <Navbar />
        <h1>User Profile: {user.username}</h1>
        <div>
          {isVerified ? (
            <p className="text-green-500">This account is Coinbase verified.</p>
          ) : (
            <p className="text-red-500">This account is not Coinbase verified.</p>
          )}
        </div>
        <AttestationList userFid={user.fid} />
        
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Handle the error, display an error message, or return a fallback UI
    return (
      <div>
        <Navbar />
        <h1>User Profile</h1>
        <p>Failed to fetch user. Please try again later.</p>
      </div>
    );
  }
};

export default UserProfilePage;