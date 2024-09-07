"use client";

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useBalance, useWalletClient } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseSepoliaPublicClient } from "@/lib/clients";

import { AuthWalletFactoryAbi } from "../../../contracts/abis/AuthWalletFactory";
import { baseSepoliaDeployedContractAddress } from "../../../contracts/deployedContractAddress";

export const AuthWalletApp = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: balance } = useBalance({ address });

  const [sendToEmail, setSendToEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [myEmail, setMyEmail] = useState("");

  useEffect(() => {
    if (isConnected) {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setMyEmail(storedEmail);
      }
    }
  }, [isConnected]);

  const handleSendETH = async () => {
    if (!walletClient) {
      throw new Error("No wallet client");
    }
    if (!sendToEmail) {
      throw new Error("Please enter recipient's email address");
    }
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      throw new Error("Please enter a valid amount to send");
    }

    const aud = process.env.NEXT_PUBLIC_CLIENT_ID || "";
    const to = await baseSepoliaPublicClient.readContract({
      abi: AuthWalletFactoryAbi,
      address: baseSepoliaDeployedContractAddress.AuthWalletFactory,
      functionName: "getDeployedAddress",
      args: [aud, sendToEmail, BigInt(0)],
    });

    const hash = await walletClient.sendTransaction({
      to,
      value: parseEther(sendAmount),
      data: "0x",
    });
    console.log("hash", hash);
    console.log("Sending", sendAmount, "ETH to:", sendToEmail);
  };

  const handleConnect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">AuthWallet</div>
          <ConnectButton
            showBalance={false}
            chainStatus={"none"}
            accountStatus={"full"}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {isConnected ? (
          <>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label>Address:</Label>
                  <div className="text-xs md:text-base">{address}</div>
                </div>
                <div>
                  <Label>Balance:</Label>
                  <div>
                    {balance?.formatted} {balance?.symbol}
                  </div>
                </div>
                <div>
                  <Label>Your Email:</Label>
                  <div>{myEmail}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Send ETH by Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sendToEmail">Recipient Email:</Label>
                  <Input
                    id="sendToEmail"
                    type="email"
                    placeholder="Enter recipient's email address"
                    value={sendToEmail}
                    onChange={(e) => setSendToEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sendAmount">Amount (ETH):</Label>
                  <Input
                    id="sendAmount"
                    type="number"
                    step="0.000000000000000001"
                    min="0"
                    placeholder="Enter amount to send"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleSendETH}
                  disabled={!sendToEmail || !sendAmount}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Send ETH
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <p className="mb-4">Connect your wallet to get started</p>
              <Button
                onClick={handleConnect}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};
