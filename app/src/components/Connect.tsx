"use client";

import { GoogleLogin } from "@react-oauth/google";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";

import { baseSepoliaPublicClient } from "@/lib/clients";

import { AuthWalletFactoryAbi } from "../../../contracts/abis/AuthWalletFactory";
import { baseSepoliaDeployedContractAddress } from "../../../contracts/deployedContractAddress";

export const Connect = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async function () {
      if (!email) {
        return;
      }
      const aud = process.env.NEXT_PUBLIC_CLIENT_ID || "";
      const address = await baseSepoliaPublicClient.readContract({
        abi: AuthWalletFactoryAbi,
        address: baseSepoliaDeployedContractAddress.AuthWalletFactory,
        functionName: "getDeployedAddress",
        args: [aud, email, BigInt(0)],
      });
      window.localStorage.setItem("address", address);
      window.localStorage.setItem("email", email);
      if (window.opener && window.opener.parent) {
        window.opener.parent.postMessage({ type: "address", address }, "*");
      }
    })();
  }, [email]);

  return (
    <GoogleLogin
      onSuccess={({ credential }) => {
        if (!credential) {
          throw new Error("No credential");
        }
        const decodedCredential = jwt.decode(credential) as jwt.JwtPayload;
        if (decodedCredential.aud !== process.env.NEXT_PUBLIC_CLIENT_ID) {
          throw new Error("Invalid audience");
        }
        if (typeof decodedCredential.email != "string") {
          throw new Error("Invalid email");
        }
        setEmail(decodedCredential.email);
      }}
    />
  );
};
