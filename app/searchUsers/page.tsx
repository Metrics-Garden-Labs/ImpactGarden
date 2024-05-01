//this page is going to let you look at the people who attest, what they have attested to, feedback and such 

//see if they are coinbase verified, and if they have a profile
//can search with farcaster username that we store etc, 

//see if they are optimism badge holders etc.  that is the task at hand. 

// userProfile.tsx

import React from "react";
import { useGlobalState } from "@/src/config/config";
import SearchUsers from "./searchUsers";
import UserList from "./userList";
import Navbar from "../components/navbar";
import { User } from '@/src/types';
import { getUsers } from '@/src/lib/db';

interface Props {
  searchParams?: {
    query?: string;
    filter?: string;
  };
}

const UserProfilePage = async ({ searchParams }: Props) => {
  const query = searchParams?.query || '';
  const filter = searchParams?.filter || '';

  try {
    const users: User[] = await getUsers();

    return (
      <div>
        <Navbar />
        <h1>Search Users Here:</h1>
        <SearchUsers />
        <UserList users={users} query={query} filter={filter} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch users:', error);
    // Handle the error, display an error message, or return a fallback UI
    return (
      <div>
        <Navbar />
        <h1>Search Users Here:</h1>
        <SearchUsers />
        <p>Failed to fetch users. Please try again later.</p>
      </div>
    );
  }
};

export default UserProfilePage;