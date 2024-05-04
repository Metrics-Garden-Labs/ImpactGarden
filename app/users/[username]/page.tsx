// // app/users/[username].tsx

import React from 'react';
import { getUserByUsername, getUserAddressesByFid  } from '../../../src/lib/db';
import { User } from '../../../src/types';
import Navbar from '../../components/navbar';
import AttestationList from '../attestationList';
import { getAttestationsByCoinbaseVerified } from '../../..//src/utils/coinbaseVerified';
import { checkOpBadgeholder } from '../../..//src/utils/opBadgeholder';
import { NetworkType, networkEndpoints } from '../../components/graphqlEndpoints';
import { getAddress } from 'viem';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import Image from 'next/image';

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
          <Navbar />
          <h1>User not found</h1>
        </div>
      );
    }

    // Fetch the user addresses and verification statuses from the database
    const userAddresses = await getUserAddressesByFid(user.fid);

    // Extract individual verification statuses
    const isCoinbaseVerified = userAddresses.some(address => address.coinbaseVerified);
    const isOpBadgeholder = userAddresses.some(address => address.opBadgeHolder);
    const isPowerBadgeholder = userAddresses.some(address => address.powerBadgeHolder);

    return (
      <div className="bg-white min-h-screen text-black">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Assume `pfp_url` is retrieved directly from `user` */}
          <Image src={user.pfp_url || ''} alt="Profile Picture" width={100} height={100} />
          <h1 className="text-2xl font-bold mb-4 flex text-center">
            User Profile: {user.username}
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
          </h1>
          <div className="mb-8">
            <div className="mb-4">
              <div className="flex items-center">
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Activity</h2>
            <AttestationList userFid={user.fid} />
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


// const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);
// console.log("Client", client);

// interface Props {
//   params: {
//     username: string;
//   };
// }



// const UserProfilePage = async ({ params }: Props) => {
//   const { username } = params;
//   try {
//     const user: User | null = await getUserByUsername(username);

//     if (!user) {
//       return (
//         <div className='bg-white text-black'>
//           <Navbar />
//           <h1>User not found</h1>
//         </div>
//       );
//     }

//     const fidData = await client.fetchBulkUsers([parseInt(user.fid)]);
//     const userData = fidData.users[0];
//     console.log("User Data", userData);
//     const response = {
//       username: userData.username,
//       ethAddress: userData.verified_addresses.eth_addresses[0],
//       pfp_url: userData.pfp_url,
//       powerbadge: userData.power_badge,
//     };

//     const coinbaseAddress = "0x357458739F90461b99789350868CD7CF330Dd7EE";
//     const selectedNetwork: NetworkType = 'Base';
//     const endpoint = networkEndpoints[selectedNetwork];
//     console.log('endpoint', endpoint);
//     console.log('ethaddress', user.ethaddress);

//     const checkAddress = getAddress(user.ethaddress || '');
//     const attestationData = await getAttestationsByCoinbaseVerified(coinbaseAddress, checkAddress, endpoint);
//     console.log('attestationData', attestationData);
//     const isVerified = attestationData && attestationData.length > 0;

//     const OpAddress = '0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9';
//     const selectedNetwork1: NetworkType = 'Optimism';
//     const endpoint1 = networkEndpoints[selectedNetwork1];
//     const opData = await checkOpBadgeholder(OpAddress, checkAddress, endpoint1);
//     const isOpBadgeholder = opData && opData.length > 0;

//     return (
//       <div className="bg-white min-h-screen text-black">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <Image src={response.pfp_url || ''} alt="Profile Picture" width={100} height={100} />
//           <h1 className="text-2xl font-bold mb-4 flex text-center">User Profile: {user.username}
//           <span className={`text-sm font-semibold ${isVerified ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
//                   {isVerified ? 
//                   <>
//                     <div className='tooltip' data-tip="Coinbase Verified Wallet">
//                       <Image src="/coinbaseWallet.png" alt="Coinbase Wallet Badge" width={25} height={25} className="align-middle mr-3" />
//                     </div>
//                   </>
//                 : ""}
//           </span>
//           <span className={`text-sm font-semibold ${isOpBadgeholder ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
//                   {isOpBadgeholder? 
//                   <>
//                     <div className='tooltip' data-tip="OP Badgeholder">
//                       <Image src="/opLogo.png" alt="OP Badge" width={20} height={20} className="align-middle mr-3" />
//                     </div>
//                   </>
//                 : ''}
//           </span>
//           <span className={`text-sm font-semibold ${response.powerbadge ? 'text-green-500' : 'text-red-500'} flex items-center p-1`}>
//                   {response.powerbadge? 
//                   <>
//                     <div className='tooltip' data-tip="Warpcast Power User">
//                       <Image src="/powerBadge.png" alt="Warpcast Power Badge" width={20} height={20} className="align-middle mr-3" />
//                     </div>
//                   </>
//                 : ''}
//           </span>
//           </h1>
//           <div className="mb-8">
//             <div className="mb-4">
//               <div className="flex items-center">
//               </div>
//             </div>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Activity</h2>
//             <AttestationList userFid={user.fid} />
//           </div>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     // Handle the error, display an error message, or return a fallback UI
//     return (
//       <div className='bg-white text-black'>
//         <Navbar />
//         <h1>User Profile</h1>
//         <p>Failed to fetch user. Please try again later.</p>
//       </div>
//     );
//   }
// };

// export default UserProfilePage;