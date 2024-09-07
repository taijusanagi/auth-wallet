import { NextResponse } from "next/server";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { baseSepoliaWalletClient } from "@/lib/clients";

import { EntryPointAbi } from "../../../../contracts/abis/EntryPoint";
import { entryPointAddress } from "../../../../contracts/externalContractAddress";
import { defaultSignerPrivateKey } from "../../../../contracts/key";

export async function POST(request: Request) {
  try {
    const account = privateKeyToAccount(
      (process.env.PRIVATE_KEY as Hex) || defaultSignerPrivateKey,
    );
    const userOp = await request.json();
    const requestId = await baseSepoliaWalletClient.writeContract({
      abi: EntryPointAbi,
      address: entryPointAddress,
      functionName: "handleOps",
      args: [[userOp], account.address],
      account,
    });
    return NextResponse.json({ transactionHash: requestId });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process bundling" },
      { status: 500 },
    );
  }
}
