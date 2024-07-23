import React from 'react';
import Link from 'next/link';
import { User } from '../../src/types';
import Image from 'next/image';
import { getUserAddressesByFid } from '../../src/lib/db/dbusers';

interface Props {
  users: User[];
  query: string;
  filter: string;
  verificationFilter: string; // Add this prop
}

export default async function UserList({ users, query, filter, verificationFilter }: Props) {
  const filteredUsers = [];

  for (const user of users) {
    if (user.fid === '9999999') {
      continue; // this should skip and not display the example user
    }

    const user_addresses = await getUserAddressesByFid(user.fid);

    const isCoinbaseVerified = user_addresses.some(address => address.coinbaseverified);
    const isOpBadgeholder = user_addresses.some(address => address.opbadgeholder);
    const isPowerBadgeholder = user_addresses.some(address => address.powerbadgeholder);
    const isDelegate = user_addresses.some(address => address.delegate);
    const s4Participant = user_addresses.some(address => address.s4participant);


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
      if (verificationFilter === 'delegate' && !isDelegate) {
        continue;
      }
      if (verificationFilter === 's4Participant' && !s4Participant) {
        continue;
      }
      filteredUsers.push({
        ...user,
        isCoinbaseVerified,
        isOpBadgeholder,
        isPowerBadgeholder,
        isDelegate,
        s4Participant
      });
    }
  }

  return (
    <div className="p-6 bg-white mx-auto gap-12 max-w-6xl">
      <div className="grid grid-cols-1 gap-4 mx-3 sm:grid-cols-2 sm:gap-4 sm:mx-3 md:grid-cols-3 md:mx-8 md:mx-8 lg:grid-cols-4 lg:gap-12 max-w-6xl overflow-y-auto">
        {filteredUsers.map((user) => (
          <Link key={user.id} href={`/users/${encodeURIComponent(user.username)}`}>
            <div className="flex flex-col p-6 border justify-center items-center bg-white text-black border-gray-300 rounded-2xl w-full h-60 shadow-lg">
              <div className="rounded-full bg-gray-300 w-32 h-32 flex items-center justify-center overflow-hidden mb-4">
                {user.pfp_url ? (
                  <Image src={user.pfp_url} alt="Profile Picture" width={128} height={128} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    No Logo
                  </div>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold flex items-center">
                {user.username}
                <span className="flex items-center space-x-2 ml-2"> {/* Added ml-2 for margin */}
                  {user.isCoinbaseVerified && (
                    <span className="tooltip" data-tip="Coinbase Verified Wallet">
                      <Image src="/coinbaseWallet.png" alt="Coinbase Wallet Badge" width={25} height={25} />
                    </span>
                  )}
                  {user.isOpBadgeholder && (
                    <span className="tooltip" data-tip="OP Badgeholder">
                      <Image src="/opLogo.png" alt="OP Badge" width={20} height={20} />
                    </span>
                  )}
                  {user.isPowerBadgeholder && (
                    <span className="tooltip" data-tip="Warpcast Power User">
                      <Image src="/powerBadge.png" alt="Warpcast Power Badge" width={20} height={20} />
                    </span>
                  )}
                  {user.isDelegate && (
                    <span className="tooltip" data-tip="Optimism Delegate">
                      <Image src="/opDelegate.png" alt="Optimism Delegate Badge" width={20} height={20} />
                    </span>
                  )}
                  {user.s4Participant && (
                    <span className="tooltip" data-tip="Season 4 Participant">
                      <Image src="/s-4grantparticipants.png" alt="Season 4 Participant Badge" width={20} height={20} />
                    </span>
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
