"use client";

import { GoogleLogin } from "@react-oauth/google";

export const Main = () => {
  return (
    <GoogleLogin
      text="signin_with"
      nonce="123"
      onSuccess={(response) => {
        console.log(response);
      }}
    />
  );
};
