// import { users, user_addresses } from "../../lib/schema";
// import { eq, Update, and } from "drizzle-orm";
// import fetch from "node-fetch";
// import { BadgeStatus } from "../badges/badgeHelper";

// import { getAttestationsByCoinbaseVerified } from "../badges/coinbaseVerified";
// import { getOptimismDelegateBadge } from "../badges/getOpDelegateBadge";
// import { checkOpBadgeholder } from "../badges/opBadgeholder";

// import { networkEndpoints } from "../../utils/graphqlEndpoints";
// import { drizzle } from "drizzle-orm/vercel-postgres";
// import { sql } from "@vercel/postgres";

// const POSTGRES_URL = process.env.POSTGRES_URL;

// if (!POSTGRES_URL) {
//   console.error("POSTGRES_URL environment variable is not set.");
//   process.exit(1); // Exit with failure
// }

// process.env.POSTGRES_URL = POSTGRES_URL;

// const db = drizzle(sql);
// const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// if (!NEYNAR_API_KEY) {
//   console.error("NEYNAR_API_KEY environment variable is not set.");
//   process.exit(1); // Exit with failure
// }

// // Function to get user address from Neynar API if not in the database
// async function getAddressFromNeynar(fid: string): Promise<string | null> {
//   const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
//   const options = {
//     method: "GET",
//     headers: { accept: "application/json", api_key: NEYNAR_API_KEY },
//   };

//   try {
//     console.log(`Fetching address from Neynar API for fid: ${fid}`);
//     const response = await fetch(url, options);
//     const data = await response.json();

//     if (data?.users?.length > 0) {
//       const user = data.users[0];
//       console.log(`Found address from Neynar API for fid: ${fid}`);
//       return user.custody_address || null;
//     } else {
//       console.log(`No address found in Neynar API for fid: ${fid}`);
//     }

//     return null;
//   } catch (error) {
//     console.error(
//       `Error fetching address from Neynar API for fid ${fid}:`,
//       error
//     );
//     return null;
//   }
// }

// // Function to get the badge statuses directly, without using helper functions
// async function getBadgesForAddress(
//   address: string
// ): Promise<BadgeStatus | null> {
//   const badgeStatus: BadgeStatus = {
//     isCoinbaseVerified: false,
//     isOpBadgeholder: false,
//     isPowerBadgeholder: false,
//     isDelegate: false,
//     s4Participant: false,
//   };

//   try {
//     // Define the necessary attester addresses and schema IDs
//     const coinbaseAttesterAddress =
//       "0xD20282EbEb88eE41b81e76E5bDc8A2dA07B2856F"; // Replace with actual attester address for Coinbase
//     const opAttesterAddress = "0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9"; // Attester address for Optimism
//     const s4AttesterAddress = "0xD20282EbEb88eE41b81e76E5bDc8A2dA07B2856F"; // Replace with actual attester address for S4

//     // Schema IDs for specific badges (replace with actual IDs)
//     const opBadgeSchemaId =
//       "0xef874554718a2afc254b064e5ce9c58c9082fb9f770250499bf406fc112bd315";
//     const delegateBadgeSchemaId = "0x..."; // Replace with actual schema ID
//     const s4ParticipantSchemaId =
//       "0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf";
//     const coinbaseVerificationSchemaId = "0x..."; // Replace with actual schema ID

//     // Use the correct endpoints from networkEndpoints
//     const baseEndpoint = networkEndpoints["Base"]; // For Coinbase verification
//     const optimismEndpoint = networkEndpoints["Optimism"]; // For other badges

//     console.log(`Checking badges for address: ${address}`);

//     // Convert address to lowercase for consistency
//     const recipientAddress = address.toLowerCase();

//     // Function to perform GraphQL queries
//     const fetchAttestations = async (
//       endpoint: string,
//       query: string,
//       variables: any
//     ) => {
//       try {
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ query, variables }),
//         });
//         const result = await response.json();
//         if (response.ok && result.data) {
//           return result.data.attestations;
//         } else {
//           console.error(`GraphQL error:`, result.errors || result);
//           return [];
//         }
//       } catch (error) {
//         console.error(`Error fetching attestations:`, error);
//         return [];
//       }
//     };

//     // Check Coinbase Verified badge (uses Base network)
//     console.log(`Checking Coinbase Verified badge for address: ${address}`);
//     const coinbaseQuery = `
//         query Attestations($attester: String!, $recipient: String!, $schemaId: String!) {
//           attestations(where: {
//             attester: { equals: $attester },
//             recipient: { equals: $recipient },
//             schemaId: { equals: $schemaId }
//           }) {
//             id
//           }
//         }
//       `;
//     const coinbaseVariables = {
//       attester: coinbaseAttesterAddress.toLowerCase(),
//       recipient: recipientAddress,
//       schemaId: coinbaseVerificationSchemaId.toLowerCase(),
//     };
//     const coinbaseAttestations = await fetchAttestations(
//       baseEndpoint,
//       coinbaseQuery,
//       coinbaseVariables
//     );
//     if (coinbaseAttestations.length > 0) {
//       badgeStatus.isCoinbaseVerified = true;
//       console.log(`Address ${address} is Coinbase Verified`);
//     }

//     // Check OP Badgeholder (uses Optimism network)
//     console.log(`Checking OP Badgeholder badge for address: ${address}`);
//     const opBadgeQuery = `
//         query Attestations($recipient: String!, $schemaId: String!) {
//           attestations(where: {
//             recipient: { equals: $recipient },
//             schemaId: { equals: $schemaId }
//           }) {
//             id
//           }
//         }
//       `;
//     const opBadgeVariables = {
//       recipient: recipientAddress,
//       schemaId: opBadgeSchemaId.toLowerCase(),
//     };
//     const opBadgeAttestations = await fetchAttestations(
//       optimismEndpoint,
//       opBadgeQuery,
//       opBadgeVariables
//     );
//     if (opBadgeAttestations.length > 0) {
//       badgeStatus.isOpBadgeholder = true;
//       console.log(`Address ${address} is an OP Badgeholder`);
//     }

//     // Check Optimism Delegate Badge (uses Optimism network)
//     console.log(`Checking Optimism Delegate badge for address: ${address}`);
//     const delegateQuery = `
//         query Attestations($recipient: String!, $schemaId: String!) {
//           attestations(where: {
//             recipient: { equals: $recipient },
//             schemaId: { equals: $schemaId }
//           }) {
//             id
//           }
//         }
//       `;
//     const delegateVariables = {
//       recipient: recipientAddress,
//       schemaId: delegateBadgeSchemaId.toLowerCase(),
//     };
//     const delegateAttestations = await fetchAttestations(
//       optimismEndpoint,
//       delegateQuery,
//       delegateVariables
//     );
//     if (delegateAttestations.length > 0) {
//       badgeStatus.isDelegate = true;
//       console.log(`Address ${address} is an Optimism Delegate`);
//     }

//     // Check S4 Participant (uses Optimism network)
//     console.log(`Checking S4 Participant badge for address: ${address}`);
//     const s4ParticipantQuery = `
//         query Attestations($recipient: String!, $schemaId: String!) {
//           attestations(where: {
//             recipient: { equals: $recipient },
//             schemaId: { equals: $schemaId }
//           }) {
//             id
//           }
//         }
//       `;
//     const s4ParticipantVariables = {
//       recipient: recipientAddress,
//       schemaId: s4ParticipantSchemaId.toLowerCase(),
//     };
//     const s4Attestations = await fetchAttestations(
//       optimismEndpoint,
//       s4ParticipantQuery,
//       s4ParticipantVariables
//     );
//     if (s4Attestations.length > 0) {
//       badgeStatus.s4Participant = true;
//       console.log(`Address ${address} is an S4 Participant`);
//     }

//     // If you have the schema ID and attester address for Power Badgeholder, add it here
//     // For example:
//     // console.log(`Checking Power Badgeholder badge for address: ${address}`);
//     // const powerBadgeSchemaId = '0x...'; // Replace with actual schema ID
//     // const powerBadgeVariables = {
//     //   recipient: recipientAddress,
//     //   schemaId: powerBadgeSchemaId.toLowerCase(),
//     // };
//     // const powerBadgeAttestations = await fetchAttestations(optimismEndpoint, opBadgeQuery, powerBadgeVariables);
//     // if (powerBadgeAttestations.length > 0) {
//     //   badgeStatus.isPowerBadgeholder = true;
//     //   console.log(`Address ${address} is a Power Badgeholder`);
//     // }
//   } catch (error) {
//     console.error(
//       `Error fetching badge statuses for address ${address}:`,
//       error
//     );
//     // Return null to indicate failure
//     return null;
//   }

//   return badgeStatus;
// }

// // Main function to process users and print their badge statuses
// export async function processUserBadges() {
//   try {
//     console.log("Starting to process user badges...");
//     // Fetch all users from the 'users' table
//     const allUsers = await db.select().from(users);
//     console.log(`Fetched ${allUsers.length} users from the database.`);

//     for (const user of allUsers) {
//       console.log(`Processing user: ${user.username}, fid: ${user.fid}`);
//       let ethAddress = user.ethaddress;

//       // If ethAddress is missing in 'users', check 'user_addresses' table
//       if (!ethAddress) {
//         console.log(
//           `No ethAddress found in 'users' table for user: ${user.username}`
//         );
//         const userAddresses = await db
//           .select()
//           .from(user_addresses)
//           .where(eq(user_addresses.userfid, user.fid));

//         if (userAddresses.length > 0) {
//           ethAddress = userAddresses[0].ethaddress;
//           console.log(
//             `Found ethAddress in 'user_addresses' table for user: ${user.username}`
//           );
//         } else {
//           console.log(
//             `No ethAddress found in 'user_addresses' table for user: ${user.username}`
//           );
//           // If ethAddress is not found, call Neynar API to get it
//           ethAddress = await getAddressFromNeynar(user.fid);

//           if (ethAddress) {
//             console.log(
//               `Fetched ethAddress from Neynar API for user: ${user.username}`
//             );
//             // Check if the address already exists in 'user_addresses'
//             const addressExists = await db
//               .select()
//               .from(user_addresses)
//               .where(
//                 and(
//                   eq(user_addresses.userfid, user.fid),
//                   eq(user_addresses.ethaddress, ethAddress)
//                 )
//               );

//             if (addressExists.length === 0) {
//               // Insert the newly fetched ethAddress into the 'user_addresses' table
//               await db.insert(user_addresses).values({
//                 userfid: user.fid,
//                 ethaddress: ethAddress,
//                 addressorder: "1", // Assign an appropriate value for this
//                 // Do not set badge statuses here
//               });
//               console.log(
//                 `Inserted ethAddress into 'user_addresses' table for user: ${user.username}`
//               );
//             } else {
//               console.log(
//                 `ethAddress already exists in 'user_addresses' table for user: ${user.username}`
//               );
//             }

//             // Update the 'users' table with the new ethAddress if it's missing
//             if (!user.ethaddress) {
//               await db
//                 .update(users)
//                 .set({ ethaddress: ethAddress })
//                 .where(eq(users.fid, user.fid));
//               console.log(
//                 `Updated 'users' table with ethAddress for user: ${user.username}`
//               );
//             }
//           } else {
//             console.log(`No ethAddress found for user: ${user.username}`);
//           }
//         }
//       }

//       if (ethAddress) {
//         // Check badges directly
//         const badgeStatus = await getBadgesForAddress(ethAddress);

//         // Proceed only if badgeStatus is not null
//         if (badgeStatus) {
//           // Fetch existing badge statuses
//           const existingBadgeStatus = await db
//             .select({
//               coinbaseverified: user_addresses.coinbaseverified,
//               opbadgeholder: user_addresses.opbadgeholder,
//               powerbadgeholder: user_addresses.powerbadgeholder,
//               delegate: user_addresses.delegate,
//               s4participant: user_addresses.s4participant,
//             })
//             .from(user_addresses)
//             .where(
//               and(
//                 eq(user_addresses.userfid, user.fid),
//                 eq(user_addresses.ethaddress, ethAddress)
//               )
//             )
//             .then((rows) => rows[0]);

//           // Prepare updated badge statuses
//           const updatedBadgeStatus = {
//             coinbaseverified:
//               badgeStatus.isCoinbaseVerified ||
//               existingBadgeStatus?.coinbaseverified ||
//               false,
//             opbadgeholder:
//               badgeStatus.isOpBadgeholder ||
//               existingBadgeStatus?.opbadgeholder ||
//               false,
//             powerbadgeholder:
//               badgeStatus.isPowerBadgeholder ||
//               existingBadgeStatus?.powerbadgeholder ||
//               false,
//             delegate:
//               badgeStatus.isDelegate || existingBadgeStatus?.delegate || false,
//             s4participant:
//               badgeStatus.s4Participant ||
//               existingBadgeStatus?.s4participant ||
//               false,
//           };

//           // Update the badge statuses
//           await db
//             .update(user_addresses)
//             .set(updatedBadgeStatus)
//             .where(
//               and(
//                 eq(user_addresses.userfid, user.fid),
//                 eq(user_addresses.ethaddress, ethAddress)
//               )
//             );
//           console.log(`Updated badge statuses for user: ${user.username}`);

//           // Print the username and badge statuses
//           console.log(
//             `User: ${user.username}, Address: ${ethAddress}, Coinbase Verified: ${updatedBadgeStatus.coinbaseverified}, OP Badgeholder: ${updatedBadgeStatus.opbadgeholder}, Power Badgeholder: ${updatedBadgeStatus.powerbadgeholder}, Delegate: ${updatedBadgeStatus.delegate}, S4 Participant: ${updatedBadgeStatus.s4participant}`
//           );
//         } else {
//           console.warn(
//             `Badge status not updated for user: ${user.username} due to invalid data`
//           );
//         }
//       } else {
//         console.log(`User: ${user.username}, no Ethereum address found.`);
//       }
//     }

//     console.log("Finished processing user badges.");
//   } catch (error) {
//     console.error("An error occurred while processing user badges:", error);
//   }
// }

// // Call the function to process all users and print badge statuses
// processUserBadges();
