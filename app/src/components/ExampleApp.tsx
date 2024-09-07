"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { zeroAddress } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { Button } from "./ui/button";

export const ExampleApp = () => {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  return (
    <>
      <ConnectButton />
      {isConnected && (
        <Button
          onClick={async () => {
            if (!walletClient) {
              throw new Error("No wallet client");
            }
            const hash = await walletClient.sendTransaction({
              to: zeroAddress,
              value: BigInt(0),
              data: "0x",
            });
            console.log("hash", hash);
          }}
        >
          SendTransaction
        </Button>
      )}
    </>
  );
};
