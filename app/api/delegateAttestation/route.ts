import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

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
    const receipt = await tx.wait();

    console.log("Transaction receipt", receipt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
