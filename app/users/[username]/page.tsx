// app/users/[username].tsx

import React from 'react';
import { getUserByUsername } from '@/src/lib/db';
import { User } from '@/src/types';
import Navbar from '../../components/navbar';
import AttestationList from '../attestationList';

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

    return (
      <div>
        <Navbar />
        <h1>User Profile: {user.username}</h1>
        {/* Display user details */}
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