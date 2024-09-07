"use client";

import { useEffect, useState } from "react";

export const SendTransaction = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const address = window.localStorage.getItem("address");
    if (!address) {
      return;
    }
    setAddress(address);
  }, []);

  return <div>{address}</div>;
};
