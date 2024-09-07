"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";

export const SendTransaction = () => {
  const [address, setAddress] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    if (window.opener && window.opener.parent) {
      const address = window.localStorage.getItem("address");
      if (!address) {
        return;
      }
      setAddress(address);
      const handleTransactionMessage = (event: MessageEvent) => {
        if (event.data.type == "sendTransaction") {
          const { from, to, value, data } = event.data;

          if (from !== address) {
            throw new Error("Invalid from address");
          }

          setTo(to);
          setValue(value);
          setData(data);
        }
      };
      window.addEventListener("message", handleTransactionMessage);
      window.opener.parent.postMessage({ type: "ready" }, "*");
      return () => {
        window.removeEventListener("message", handleTransactionMessage);
      };
    }
  }, []);

  const handleTransaction = () => {
    const transactionHash =
      "0x83a3c12c80c0f01cf1178cd5c5b600895bb660a9145fdf520e7a7a5fa82fc3f6";
    if (window.opener && window.opener.parent) {
      window.opener.parent.postMessage(
        { type: "transactionHash", transactionHash },
        "*",
      );
    }
  };

  return (
    <div>
      <p>{to}</p>
      <p>{value}</p>
      <p>{data}</p>
      <Button onClick={handleTransaction}>Send</Button>
    </div>
  );
};
