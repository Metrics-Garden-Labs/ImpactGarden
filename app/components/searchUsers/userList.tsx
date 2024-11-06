import React from 'react';
import Link from 'next/link';
import { User } from '@/src/types';
import Image from 'next/image';
import { getUserAddressesByFid } from '@/src/lib/db/dbusers';
import { BadgeDisplay } from '@/app/components/ui/BadgeDisplay';
import { getUserBadgeStatus } from '@/src/utils/badges/badgeHelper';


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

    const { isCoinbaseVerified, isOpBadgeholder, isPowerBadgeholder, isDelegate, s4Participant } = await getUserBadgeStatus(user.fid);

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
            <div className="flex flex-col p-6 border justify-center items-center bg-white text-black border-lime-900/30 rounded-2xl w-full h-60 shadow-lg">
              <div className="rounded-full bg-gray-300 w-32 h-32 flex items-center justify-center overflow-hidden mb-4">
                {user.pfp_url ? (
                  <Image src={user.pfp_url} alt="Profile Picture" width={128} height={128} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    No Logo
                  </div>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold flex items-center ">
                {user.username}
                <BadgeDisplay
                  isCoinbaseVerified={user.isCoinbaseVerified}
                  isOpBadgeholder={user.isOpBadgeholder}
                  isPowerBadgeholder={user.isPowerBadgeholder}
                  isDelegate={user.isDelegate}
                  s4Participant={user.s4Participant}
                />
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
