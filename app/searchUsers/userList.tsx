// userList.tsx

import React from 'react';
import Link from 'next/link';
import { User } from '../../src/types';
import Image from 'next/image';

interface Props {
  users: User[];
  query: string;
  filter: string;
}

export default function UserList({ users, query, filter }: Props) {
  const filteredUsers = query
    ? users.filter((user) => {
        if (filter === 'username') {
          return (user.username?.toLowerCase() || '').includes(query.toLowerCase());
        } else if (filter === 'fid') {
          return (user.fid?.toLowerCase() || '').includes(query.toLowerCase());
        }
        return false;
      })
    : users;

  return (
    <div className="p-6 bg-white">
      <div className="grid grid-cols-3 gap-12">
        {filteredUsers.map((user) => (
          <Link key={user.id} href={`/users/${encodeURIComponent(user.username)}`}>
          <div className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-xl w-full h-60 shadow-lg"
          >
            <div className="rounded-full bg-gray-300 w-32 h-32 flex items-center justify-center overflow-hidden mb-4">
              {user.pfp_url ? (
                <Image
                  src={user.pfp_url}
                  alt="Project Logo"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  {/* Add optional placeholder content if needed */}
                  No Logo
                </div>
              )}
            </div> 
            <h3 className="mb-2 text-xl font-semibold">{user.username}</h3>
            <p>FID: {user.fid}</p>
            {/* Display user's attestations */}
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
