import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { Alchemy, Network } from "alchemy-sdk";
import { net } from "web3";

export const maxDuration = 30; // This function can run for a maximum of 30 seconds, hopefully will solve the timeout issue
export const dynamic = "force-dynamic";

dotenv.config();

const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendTransaction(
  contract: ethers.Contract,
  contractData: any,
  retries = 0
): Promise<any> {
  try {
    const tx = await contract.attest(contractData);
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
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const {
      schema,
      recipient,
      data,
      expirationTime,
      revocable,
      refUID,
      value,
    } = req;

    const privateKey = process.env.BACKEND_METAMASK_PRIVATE_KEY;
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

    if (!privateKey) {
      throw new Error("BACKEND_METAMASK_PRIVATE_KEY is not set");
    }
    if (!alchemyApiKey) {
      throw new Error("ALCHEMY_API_KEY is not set");
    }

    console.log("Using Alchemy API Key:", alchemyApiKey);

    const settings = {
      apiKey: alchemyApiKey,
      network: Network.OPT_MAINNET,
    };

    // const alchemy = new Alchemy(settings);
    // console.log("Alchemy:", alchemy);
    const network = new ethers.Network("optimism", 10);
    const alchemyProvider = new ethers.AlchemyProvider(
      network,
      settings.apiKey
    );
    const backendWallet = new ethers.Wallet(privateKey, alchemyProvider);
    console.log("Backend Wallet Address:", backendWallet.address);

    const contract = new ethers.Contract(
      "0x4200000000000000000000000000000000000021",
      [
        {
          inputs: [
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "schema",
                  type: "bytes32",
                },
                {
                  components: [
                    {
                      internalType: "address",
                      name: "recipient",
                      type: "address",
                    },
                    {
                      internalType: "uint64",
                      name: "expirationTime",
                      type: "uint64",
                    },
                    {
                      internalType: "bool",
                      name: "revocable",
                      type: "bool",
                    },
                    {
                      internalType: "bytes32",
                      name: "refUID",
                      type: "bytes32",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      internalType: "uint256",
                      name: "value",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct AttestationRequestData",
                  name: "data",
                  type: "tuple",
                },
              ],
              internalType: "struct AttestationRequest",
              name: "request",
              type: "tuple",
            },
          ],
          name: "attest",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
      ],
      backendWallet
    );

    const contractData = {
      schema,
      data: {
        recipient,
        expirationTime,
        revocable,
        refUID,
        data,
        value,
      },
    };

    console.log("Contract Data:", contractData);

    const { txHash, receipt } = await sendTransaction(contract, contractData);
    console.log("Transaction Hash:", txHash);
    console.log("Transaction Receipt:", receipt);

    const detailedReceipt = await alchemyProvider.getTransactionReceipt(txHash);
    console.log("Detailed Transaction Receipt:", detailedReceipt);

    if (detailedReceipt) {
      const attestationLog = detailedReceipt.logs.find(
        (log) => log.data !== "0x"
      );
      if (attestationLog) {
        const attestationUID = attestationLog.data;
        console.log("Attestation UID:", attestationUID);
        return NextResponse.json({
          success: true,
          attestationUID,
          receipt,
        });
      } else {
        console.error("Attestation UID not found in the transaction receipt");
        return NextResponse.json({
          success: false,
          error: "Attestation UID not found",
        });
      }
    } else {
      console.error("Failed to retrieve the detailed transaction receipt");
      return NextResponse.json({
        success: false,
        error: "Failed to retrieve the detailed transaction receipt",
      });
    }
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
