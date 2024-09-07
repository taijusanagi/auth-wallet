"use client";

import { GoogleLogin } from "@react-oauth/google";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { zeroAddress } from "viem";

export const Connect = () => {
  const [aud, setAud] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!aud || !email) {
      return;
    }
    const address = zeroAddress;
    window.localStorage.setItem("address", address);
    // if (window.opener && window.opener.parent) {
    //   window.opener.parent.postMessage({ address }, "*");
    // }
  }, [aud, email]);

  return (
    <GoogleLogin
      nonce="0xfb963648437127148c0869f39e165fcfd6a40a1beaac62ebe1c916cb777cd724"
      onSuccess={({ credential }) => {
        console.log(credential);

        if (!credential) {
          throw new Error("No credential");
        }
        const decodedCredential = jwt.decode(credential) as jwt.JwtPayload;
        if (typeof decodedCredential.aud != "string") {
          throw new Error("Invalid audience");
        }
        if (typeof decodedCredential.email != "string") {
          throw new Error("Invalid email");
        }

        setAud(decodedCredential.aud);
        setEmail(decodedCredential.email);
      }}
    />
  );
};
