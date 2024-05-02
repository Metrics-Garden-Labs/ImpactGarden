import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

export const maxDuration = 30; // This function can run for a maximum of 30, hopefully will solve the timeout issue
export const dynamic = "force-dynamic";

//if it keeps timing out, i will make multiple api routes for each operation that do the same thing.
dotenv.config();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const {
      signature,
      attester,
      recipient,
      schema,
      refUID,
      data,
      deadline,
      value,
      expirationTime,
    } = req;

    console.log("Signature", signature);
    console.log("Attester Address", recipient);
    console.log("Schema UID", schema);
    console.log("Ref UID", refUID);
    console.log("Encoded Data", data);

    const privateKey = process.env.BACKEND_METAMASK_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("BACKEND_METAMASK_PRIVATE_KEY is not set");
    }
    const provider = ethers.getDefaultProvider("optimism");
    const backendWallet = new ethers.Wallet(privateKey, provider);

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
                {
                  components: [
                    {
                      internalType: "uint8",
                      name: "v",
                      type: "uint8",
                    },
                    {
                      internalType: "bytes32",
                      name: "r",
                      type: "bytes32",
                    },
                    {
                      internalType: "bytes32",
                      name: "s",
                      type: "bytes32",
                    },
                  ],
                  internalType: "struct EIP712Signature",
                  name: "signature",
                  type: "tuple",
                },
                {
                  internalType: "address",
                  name: "attester",
                  type: "address",
                },
              ],
              internalType: "struct DelegatedAttestationRequest",
              name: "delegatedRequest",
              type: "tuple",
            },
          ],
          name: "attestByDelegation",
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
      schema: schema,
      data: {
        recipient: recipient,
        expirationTime: expirationTime,
        revocable: true,
        refUID: refUID,
        data: data,
        value: value,
      },
      signature: signature,
      attester: attester,
      deadline: deadline,
    };

    console.log(contractData);

    const tx = await contract.attestByDelegation(contractData);
    const txHash = tx.hash;
    console.log("Transaction Hash:", txHash);

    const receipt = await tx.wait();
    console.log("Transaction Receipt:", receipt);

    // Get the transaction receipt using the transaction hash
    const detailedReceipt = await provider.getTransactionReceipt(txHash);
    console.log("Detailed Transaction Receipt:", detailedReceipt);

    if (detailedReceipt) {
      // Find the log entry with the attestation UID
      const attestationLog = detailedReceipt.logs.find(
        (log) => log.data !== "0x"
      );

      if (attestationLog) {
        const attestationUID = attestationLog.data;
        console.log("Attestation UID:", attestationUID);

        return NextResponse.json({
          success: true,
          attestationUID: attestationUID,
          receipt: receipt,
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
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
