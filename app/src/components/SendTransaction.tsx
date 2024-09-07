"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { encodeFunctionData, toHex } from "viem";

import { baseSepoliaPublicClient } from "@/lib/clients";
import { sampleJWT } from "@/lib/jwt";
import { request } from "@/lib/rpc";

import { AuthWalletAbi } from "../../../contracts/abis/AuthWallet";
import { AuthWalletFactoryAbi } from "../../../contracts/abis/AuthWalletFactory";
import { EntryPointAbi } from "../../../contracts/abis/EntryPoint";
import { baseSepoliaDeployedContractAddress } from "../../../contracts/deployedContractAddress";
import { entryPointAddress } from "../../../contracts/externalContractAddress";

export const SendTransaction = () => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [userOp, setUserOp] = useState<any>();
  const [userOpHash, setUserOpHash] = useState("");

  useEffect(() => {
    if (window.opener && window.opener.parent) {
      const email = window.localStorage.getItem("email");
      const address = window.localStorage.getItem("address");
      if (!email || !address) {
        return;
      }
      const aud = process.env.NEXT_PUBLIC_CLIENT_ID || "";
      const handleTransactionMessage = async (event: MessageEvent) => {
        if (event.data.type == "sendTransaction") {
          const { from, to, value, data } = event.data;

          if (from !== address) {
            throw new Error("Invalid from address");
          }

          setTo(to);
          setValue(value);
          setData(data);

          const nonce = await baseSepoliaPublicClient.readContract({
            abi: EntryPointAbi,
            address: entryPointAddress,
            functionName: "getNonce",
            args: [from, BigInt(0)],
          });
          console.log("nonce", nonce);
          let initCode = "0x";
          const code = await baseSepoliaPublicClient.getCode({ address: from });
          if (!code || code === "0x") {
            const initCallData = encodeFunctionData({
              abi: AuthWalletFactoryAbi,
              functionName: "createAccount",
              args: [aud, email, BigInt(0)],
            });
            const factoryAddressBytes =
              baseSepoliaDeployedContractAddress.AuthWalletFactory.toLowerCase().replace(
                "0x",
                "",
              );
            initCode = `0x${factoryAddressBytes}${initCallData.slice(2)}`;
          }
          console.log("initCode", initCode);
          const callData = encodeFunctionData({
            abi: AuthWalletAbi,
            functionName: "execute",
            args: [to, value, data],
          });
          console.log("callData", callData);

          const userOp = {
            sender: address,
            nonce: toHex(nonce),
            initCode,
            callData,
            maxFeePerGas: "0x0",
            maxPriorityFeePerGas: "0x0",
            paymasterAndData: "0x",
            signature: toHex(sampleJWT),
          } as any;

          console.log("userOp", userOp);

          const latestBlock = await baseSepoliaPublicClient.getBlock();
          console.log("latestBlock", latestBlock);
          const baseFeePerGas = latestBlock.baseFeePerGas || BigInt(0);
          console.log("baseFeePerGas", baseFeePerGas);
          const adjustedBaseFeePerGas =
            baseFeePerGas + baseFeePerGas / BigInt(4);

          const { result: maxPriorityFeePerGasHex } = await request(
            "rundler_maxPriorityFeePerGas",
            [],
          );
          const maxPriorityFeePerGas = BigInt(maxPriorityFeePerGasHex);
          console.log("maxPriorityFeePerGas", maxPriorityFeePerGas);
          const adjustedMaxPriorityFeePerGas =
            maxPriorityFeePerGas + maxPriorityFeePerGas / BigInt(4);
          console.log(
            "adjustedMaxPriorityFeePerGas",
            adjustedMaxPriorityFeePerGas,
          );
          const maxFeePerGas =
            adjustedBaseFeePerGas + BigInt(adjustedMaxPriorityFeePerGas);
          console.log("maxFeePerGas", maxFeePerGas);

          userOp.maxFeePerGas = toHex(maxFeePerGas);
          userOp.maxPriorityFeePerGas = toHex(adjustedMaxPriorityFeePerGas);

          const estimateUserOperationGasRes = await request(
            "eth_estimateUserOperationGas",
            [userOp, entryPointAddress],
          );

          console.log(
            "estimateUserOperationGasRes",
            estimateUserOperationGasRes,
          );
          if (estimateUserOperationGasRes.error) {
            throw new Error(estimateUserOperationGasRes.error.message);
          }

          const { callGasLimit, preVerificationGas, verificationGasLimit } =
            estimateUserOperationGasRes.result;
          console.log("callGasLimit", callGasLimit);
          console.log("preVerificationGas", preVerificationGas);
          console.log("verificationGasLimit", verificationGasLimit);
          userOp.callGasLimit = callGasLimit;
          userOp.preVerificationGas = preVerificationGas;
          userOp.verificationGasLimit = verificationGasLimit;

          const userOpHash = await baseSepoliaPublicClient.readContract({
            abi: EntryPointAbi,
            address: entryPointAddress,
            functionName: "getUserOpHash",
            args: [userOp],
          });
          console.log("userOpHash", userOpHash);
          setUserOp(userOp);
          setUserOpHash(userOpHash);
        }
      };
      window.addEventListener("message", handleTransactionMessage);
      window.opener.parent.postMessage({ type: "ready" }, "*");
      return () => {
        window.removeEventListener("message", handleTransactionMessage);
      };
    }
  }, []);

  return (
    <div>
      <p>{to}</p>
      <p>{value}</p>
      <p>{data}</p>
      {userOp && userOpHash && (
        <GoogleLogin
          nonce={userOpHash}
          onSuccess={async ({ credential }) => {
            if (!credential) {
              throw new Error("No credential");
            }
            userOp.signature = toHex(credential);
            const ethSendUserOperationRes = await fetch("/bundler", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "eth_sendUserOperation",
                params: [userOp, entryPointAddress],
              }),
            }).then((res) => res.json());
            console.log("ethSendUserOperationRes", ethSendUserOperationRes);
            const requestId = ethSendUserOperationRes.result;

            const pollReceipt = async (requestId: string): Promise<any> => {
              return new Promise((resolve, reject) => {
                const interval = setInterval(async () => {
                  console.log("pollReceipt... ", requestId);
                  const userOperationReceipt = await request(
                    "eth_getUserOperationReceipt",
                    [requestId],
                  );
                  if (userOperationReceipt.error) {
                    clearInterval(interval);
                    reject(userOperationReceipt.error.message);
                  }
                  if (userOperationReceipt.result) {
                    clearInterval(interval);
                    resolve(userOperationReceipt.result.receipt);
                  }
                }, 2000);
              });
            };
            const userOperationReceipt = await pollReceipt(requestId);
            console.log("userOperationReceipt", userOperationReceipt);

            const transactionHash = userOperationReceipt.transactionHash;
            console.log("transactionHash", transactionHash);

            if (window.opener && window.opener.parent) {
              window.opener.parent.postMessage(
                { type: "transactionHash", transactionHash },
                "*",
              );
            }
          }}
        />
      )}
    </div>
  );
};
