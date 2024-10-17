"use server";

import { ethers } from "ethers";
import dotenv from "dotenv";
import { Network } from "alchemy-sdk";
import { EAS } from "@ethereum-attestation-service/eas-sdk";

dotenv.config();

const MAX_RETRIES = 3;

const reviewSchema =
  "0xc9bc703e3c48be23c1c09e2f58b2b6657e42d8794d2008e3738b4ab0e2a3a8b6";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function sendTransaction(
  contract: ethers.Contract,
  contractData: any,
  retries = 0
): Promise<any> {
  try {
    const tx = await contract.revoke(contractData);
    const txHash = tx.hash;
    console.log("Transaction Hash:", txHash);

    const receipt = await tx.wait();
    console.log("Transaction Receipt:", receipt);

    return { txHash, receipt };
  } catch (error) {
    console.error("Error in sendTransaction:", error);
    if (retries < MAX_RETRIES) {
      console.log(`Retry ${retries + 1}/${MAX_RETRIES}`);
      await delay(1000 * (retries + 1)); // Exponential backoff
      return sendTransaction(contract, contractData, retries + 1);
    }
  }
}

// export async function revokeAttestationBackend(uid: string) {
//   const privateKey = process.env.BACKEND_METAMASK_PRIVATE_KEY;
//   const alchemyApiKey = process.env.ALCHEMY_API_KEY;
//   //   const uidBytes32 = ethers.encodeBytes32String(uid);

//   console.log("Revoking attestation with UID:", uid);
//   console.log("Review Schema:", reviewSchema);

//   if (!privateKey) {
//     throw new Error("BACKEND_METAMASK_PRIVATE_KEY is not set");
//   }
//   if (!alchemyApiKey) {
//     throw new Error("ALCHEMY_API_KEY is not set");
//   }

//   const settings = {
//     apiKey: alchemyApiKey,
//     network: Network.OPT_MAINNET,
//   };

//   const network = new ethers.Network("optimism", 10);
//   const alchemyProvider = new ethers.AlchemyProvider(network, settings.apiKey);

//   const backendWallet = new ethers.Wallet(privateKey, alchemyProvider);
//   console.log("Backend Wallet Address:", backendWallet.address);

//   const contract = new ethers.Contract(
//     "0x4200000000000000000000000000000000000021",
//     [
//       {
//         inputs: [
//           {
//             components: [
//               {
//                 internalType: "bytes32",
//                 name: "schema",
//                 type: "bytes32",
//               },
//               {
//                 components: [
//                   {
//                     internalType: "bytes32",
//                     name: "uid",
//                     type: "bytes32",
//                   },
//                   {
//                     internalType: "uint256",
//                     name: "value",
//                     type: "uint256",
//                   },
//                 ],
//                 internalType: "struct RevocationRequestData",
//                 name: "data",
//                 type: "tuple",
//               },
//             ],
//             internalType: "struct RevocationRequest",
//             name: "request",
//             type: "tuple",
//           },
//         ],
//         name: "revoke",
//         outputs: [],
//         stateMutability: "payable",
//         type: "function",
//       },
//     ],
//     backendWallet
//   );

//   const contractData = {
//     request: {
//       schema: reviewSchema,
//       data: {
//         uid: uid,
//       },
//     },
//   };
//   console.log("Contract Data:", contractData);

//   const result = await sendTransaction(contract, contractData);
//   if (!result || !result.txHash) {
//     throw new Error("Transaction failed; txHash is undefined.");
//   }
//   const { txHash, receipt } = result;

//   const detailedReceipt = await alchemyProvider.getTransactionReceipt(txHash);

//   if (detailedReceipt) {
//     return { success: true, receipt };
//   } else {
//     return { success: false, receipt };
//   }
// }

export async function revokeAttestationBackend(attestationUID: string) {
  const privateKey = process.env.BACKEND_METAMASK_PRIVATE_KEY;
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;

  console.log("Revoking attestation with UID:", attestationUID);
  console.log("Review Schema:", reviewSchema);

  if (!privateKey) {
    throw new Error("BACKEND_METAMASK_PRIVATE_KEY is not set");
  }
  if (!alchemyApiKey) {
    throw new Error("ALCHEMY_API_KEY is not set");
  }

  const settings = {
    apiKey: alchemyApiKey,
    network: Network.OPT_MAINNET,
  };

  const network = new ethers.Network("optimism", 10);
  const alchemyProvider = new ethers.AlchemyProvider(network, settings.apiKey);

  const backendWallet = new ethers.Wallet(privateKey, alchemyProvider);
  console.log("Backend Wallet Address:", backendWallet.address);

  const easInstance = new EAS("0x4200000000000000000000000000000000000021");
  easInstance.connect(backendWallet);
  console.log("gotsigner");

  const attestation = await easInstance.getAttestation(attestationUID);
  console.log("Attestation:", attestation);

  const transaction = await easInstance.revoke({
    schema: attestation.schema,
    data: {
      uid: attestation.uid,
    },
  });
  const receipt = await transaction.wait();

  console.log("Revoke result:", receipt);
  if (receipt == undefined) {
    throw new Error("Transaction failed; txHash is undefined.");
  } else {
    return { success: true, receipt: receipt };
  }
}
