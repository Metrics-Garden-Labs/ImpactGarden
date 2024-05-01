// userList.tsx

import React from 'react';
import Link from 'next/link';
import { User } from '../../src/types';

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
