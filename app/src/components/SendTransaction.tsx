"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";

export const SendTransaction = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const address = window.localStorage.getItem("address");
    if (!address) {
      return;
    }
    setAddress(address);
  }, []);

  const handleTransaction = async () => {
    const transactionHash =
      "0x83a3c12c80c0f01cf1178cd5c5b600895bb660a9145fdf520e7a7a5fa82fc3f6";
    if (window.opener && window.opener.parent) {
      window.opener.parent.postMessage({ transactionHash }, "*");
    }
  };

  return (
    <div>
      <Button onClick={handleTransaction}></Button>
    </div>
  );
};
