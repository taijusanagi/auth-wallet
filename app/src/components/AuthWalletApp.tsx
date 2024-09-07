"use client";

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Shield, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useBalance, useDisconnect, useWalletClient } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseSepoliaPublicClient } from "@/lib/clients";

import { AuthWalletFactoryAbi } from "../../../contracts/abis/AuthWalletFactory";
import { JWKSAutomatedOracle } from "../../../contracts/abis/JWKSAutomatedOracle";
import { baseSepoliaDeployedContractAddress } from "../../../contracts/deployedContractAddress";

export const AuthWalletApp = () => {
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: balance } = useBalance({ address });

  const [sendToEmail, setSendToEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [myEmail, setMyEmail] = useState("");

  const [oracleStatus, setOracleStatus] = useState("Loading...");

  useEffect(() => {
    if (isConnected) {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setMyEmail(storedEmail);
      }
    }

    fetch("https://www.googleapis.com/oauth2/v3/certs")
      .then((response) => response.json())
      .then(async (data) => {
        let oracleStatus = "Good";
        for (const key of data.keys) {
          const modulus = await baseSepoliaPublicClient.readContract({
            abi: JWKSAutomatedOracle,
            address: baseSepoliaDeployedContractAddress.JWKSAutomatedOracle,
            functionName: "kidToModulus",
            args: [key.kid],
          });
          if (
            modulus.substring(2) !==
            Buffer.from(key.n, "base64").toString("hex")
          ) {
            oracleStatus = "Bad";
          }
        }
        setOracleStatus(oracleStatus);
      })
      .catch((error) => {
        console.error("Error fetching JWKS data:", error);
        setOracleStatus("Bad");
      });
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

  const contractUrl = `https://sepolia.basescan.org/address/${baseSepoliaDeployedContractAddress.JWKSAutomatedOracle}`; // Replace with actual contract URL
  const certUrl = "https://www.googleapis.com/oauth2/v3/certs";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={() => disconnect()}
          >
            AuthWallet
          </div>
          <ConnectButton
            showBalance={false}
            chainStatus={"none"}
            accountStatus={"full"}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {isConnected ? (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label>Address:</Label>
                    <div className="text-xs lg:text-base">{address}</div>
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
                  <CardTitle>JWKS Oracle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label>Contract URL:</Label>
                    <div className="text-xs lg:text-sm break-all">
                      <a
                        href={contractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {contractUrl}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Label>JWKS URL:</Label>
                    <div className="text-xs lg:text-sm break-all">
                      <a
                        href={certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {certUrl}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Label>Oracle Status:</Label>
                    <div
                      className={`text-xs lg:text-sm font-semibold ${oracleStatus === "Good" ? "text-green-600" : "text-red-600"}`}
                    >
                      {oracleStatus}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Wallet className="inline-block text-indigo-600 mb-6" size={80} />
              <h1 className="text-5xl font-bold text-indigo-600 mb-6">
                AuthWallet
              </h1>
              <p className="text-2xl text-gray-700">
                Revolutionizing Wallet Management with Simplicity and Security
              </p>
            </motion.section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">
                Addressing Key Challenges
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Wallet,
                    title: "Wallet Complexity",
                    description:
                      "Managing private keys, seed phrases, and multiple accounts is overwhelmingly complex for most users.",
                  },
                  {
                    icon: Shield,
                    title: "Security vs. Usability",
                    description:
                      "Advanced solutions like MPC wallets provide security but are too complicated for average users to adopt.",
                  },
                  {
                    icon: Lightbulb,
                    title: "The Need for Simplicity",
                    description:
                      "A secure and user-friendly wallet solution is desperately needed. This is where AuthWallet steps in to bridge the gap.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg h-full">
                      <CardContent className="p-6 flex flex-col items-center h-full">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                          <item.icon className="text-indigo-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-indigo-700 text-center">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-center flex-grow">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">
                Our Innovative Solution
              </h2>
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8 space-y-6">
                  {[
                    "Leveraging OAuth2.0 and OpenID Connect: Web2's gold standard for authorization",
                    "Smart contracts as Web2 servers: Bringing familiar auth to Account Abstraction wallets",
                    "Secure on-chain verification: Implementing JWT and RSA in smart contracts",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <ArrowRight className="text-indigo-600 flex-shrink-0" />
                      <p className="text-lg text-gray-700">{item}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="bg-indigo-600 text-white text-center shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Experience the Future of Wallet Management?
                  </h3>
                  <p className="mb-6 text-indigo-100">
                    Connect your wallet and start your journey with AuthWallet
                    today!
                  </p>
                  <Button
                    onClick={handleConnect}
                    className="bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-2 px-6 rounded-full text-lg transition duration-300"
                  >
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};
