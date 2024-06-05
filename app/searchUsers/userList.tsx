import React from 'react';
import Link from 'next/link';
import { User } from '../../src/types';
import Image from 'next/image';
import { getUserAddressesByFid } from '../../src/lib/db';

interface Props {
  users: User[];
  query: string;
  filter: string;
  verificationFilter: string; // Add this prop
}

export default async function UserList({ users, query, filter, verificationFilter }: Props) {
  const filteredUsers = [];

  for (const user of users) {
    const user_addresses = await getUserAddressesByFid(user.fid);

    const isCoinbaseVerified = user_addresses.some(address => address.coinbaseverified);
    const isOpBadgeholder = user_addresses.some(address => address.opbadgeholder);
    const isPowerBadgeholder = user_addresses.some(address => address.powerbadgeholder);

    let matchesFilter = true;

    if (filter === 'username') {
      matchesFilter = (user.username?.toLowerCase() || '').includes(query.toLowerCase());
    } else if (filter === 'fid') {
      matchesFilter = (user.fid?.toLowerCase() || '').includes(query.toLowerCase());
    }

    if (matchesFilter) {
      if (verificationFilter === 'coinbaseVerified' && !isCoinbaseVerified) {
        continue;
      }
      if (verificationFilter === 'opBadgeholder' && !isOpBadgeholder) {
        continue;
      }
      if (verificationFilter === 'powerBadgeholder' && !isPowerBadgeholder) {
        continue;
      }
      filteredUsers.push({ ...user, isCoinbaseVerified, isOpBadgeholder, isPowerBadgeholder });
    }
  }

  return (
    <div className="p-6 bg-white mx-auto gap-12 max-w-6xl">
      <div className="grid grid-cols-2 gap-4 mx-3 md:grid-cols-3 md:mx-8 md:mx-8 lg:grid-cols-4 lg:gap-12 max-w-6xl overflow-y-auto">
        {filteredUsers.map((user) => (
          <Link key={user.id} href={`/users/${encodeURIComponent(user.username)}`}>
            <div className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-2xl w-full h-60 shadow-lg">
              <div className="rounded-full bg-gray-300 w-32 h-32 flex items-center justify-center overflow-hidden mb-4">
                {user.pfp_url ? (
                  <Image src={user.pfp_url} alt="Project Logo" width={128} height={128} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    No Logo
                  </div>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold flex items-center">
                {user.username}
                <span className={`text-sm font-semibold ${user.isCoinbaseVerified ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
                  {user.isCoinbaseVerified && (
                    <div className='tooltip' data-tip="Coinbase Verified Wallet">
                      <Image src="/coinbaseWallet.png" alt="Coinbase Wallet Badge" width={25} height={25} className="align-middle mr-3" />
                    </div>
                  )}
                </span>
                <span className={`text-sm font-semibold ${user.isOpBadgeholder ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
                  {user.isOpBadgeholder && (
                    <div className='tooltip' data-tip="OP Badgeholder">
                      <Image src="/opLogo.png" alt="OP Badge" width={20} height={20} className="align-middle mr-3" />
                    </div>
                  )}
                </span>
                <span className={`text-sm font-semibold ${user.isPowerBadgeholder ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
                  {user.isPowerBadgeholder && (
                    <div className='tooltip' data-tip="Warpcast Power User">
                      <Image src="/powerBadge.png" alt="Warpcast Power Badge" width={20} height={20} className="align-middle mr-3" />
                    </div>
                  )}
                </span>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
