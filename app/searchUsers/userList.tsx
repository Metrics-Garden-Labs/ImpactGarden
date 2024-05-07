

// userList.tsx
import React from 'react';
import Link from 'next/link';
import { User } from '../../src/types';
import Image from 'next/image';
import { getUserAddressesByFid } from '../../src/lib/db';

interface Props {
  users: User[];
  query: string;
  filter: string;
}

export default async function UserList({ users, query, filter }: Props) {
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
      <div className="grid grid-cols-4 gap-12 ml-40 mr-40">
        {filteredUsers.map(async (user) => {
          // Fetch the user addresses and verification statuses from the database
          const user_addresses = await getUserAddressesByFid(user.fid);

          // Extract individual verification statuses
          const isCoinbaseVerified = user_addresses.some(address => address.coinbaseverified);
          const isOpBadgeholder = user_addresses.some(address => address.opbadgeholder);
          const isPowerBadgeholder = user_addresses.some(address => address.powerbadgeholder);

          return (
            <Link key={user.id} href={`/users/${encodeURIComponent(user.username)}`}>
              <div className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-2xl w-full h-60 shadow-lg">
                <div className="rounded-full bg-gray-300 w-32 h-32 flex items-center justify-center overflow-hidden mb-4">
                  {user.pfp_url ? (
                    <Image src={user.pfp_url} alt="Project Logo" width={128} height={128} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center text-gray-500">
                      {/* Add optional placeholder content if needed */}
                      No Logo
                    </div>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold flex items-center">
                  {user.username}
                  <span className={`text-sm font-semibold ${isCoinbaseVerified ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
                    {isCoinbaseVerified && (
                      <div className='tooltip' data-tip="Coinbase Verified Wallet">
                        <Image src="/coinbaseWallet.png" alt="Coinbase Wallet Badge" width={25} height={25} className="align-middle mr-3" />
                      </div>
                    )}
                  </span>
                  <span className={`text-sm font-semibold ${isOpBadgeholder ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
                    {isOpBadgeholder && (
                      <div className='tooltip' data-tip="OP Badgeholder">
                        <Image src="/opLogo.png" alt="OP Badge" width={20} height={20} className="align-middle mr-3" />
                      </div>
                    )}
                  </span>
                  <span className={`text-sm font-semibold ${isPowerBadgeholder ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
                    {isPowerBadgeholder && (
                      <div className='tooltip' data-tip="Warpcast Power User">
                        <Image src="/powerBadge.png" alt="Warpcast Power Badge" width={20} height={20} className="align-middle mr-3" />
                      </div>
                    )}
                  </span>
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
