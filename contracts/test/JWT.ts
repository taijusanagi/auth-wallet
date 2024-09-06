import { expect } from "chai";
import { ethers } from "hardhat";
import crypto from "crypto";
import { JWT } from "../typechain-types";

describe("JWTDecoder", function () {
  let jwtDecoder: JWT;
  const jwt =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQyNWY4ZGJjZjk3ZGM3ZWM0MDFmMDE3MWZiNmU2YmRhOWVkOWU3OTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2Nzc2MTYyMTksImF1ZCI6IjIyNTg4NDIxNjkwMS1yZm42azc5cmxtdG9hYXAzc2tqZWxicnQzdHA2c3FuNS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNDg5NTE2NDg0Nzc4NDY0NTE5MCIsIm5vbmNlIjoiY0psNWNNVVlFdHc2QVF4OUFiVU9EUmZjZWNnIiwiZW1haWwiOiJtYWlsaHVyYkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMjI1ODg0MjE2OTAxLXJmbjZrNzlybG10b2FhcDNza2plbGJydDN0cDZzcW41LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6Ikx1Y2FzIEhlbm5pbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WUtybXFkYmdpMjItcjcwSG8wWnc1NnVWWXJlSE9TaTNyTXFsc3l1Z2c9czk2LWMiLCJnaXZlbl9uYW1lIjoiTHVjYXMiLCJmYW1pbHlfbmFtZSI6Ikhlbm5pbmciLCJpYXQiOjE2Nzc2MTY1MTksImV4cCI6MTY3NzYyMDExOSwianRpIjoiOWJkYzZkYzNmYjI5ZTBhNGQ0MGY4ZDU5NGUzOTQ2MGJhMzU0YzY4NyJ9.B5Koqqa9DuAryoNN906itjQJb4GjrpuQQOgriyw5-mK6_OUOJa2zPhFexjYF_UXSd0dkIHu_SDZGJnfzuD_kPT4pmzFDFPkbzJFKOR-sRT-rTpT5EqOtvDyW6N26-KsxBQAkC6GYdJVT8d6udXBOHxMSpM2ZgTkp45810n9FAlc2hB9QU7FmKeBaqWPSKhswZwq0YCagvvFMqSb1JYzQXg3qjtF6DHLSuOngjyeqfqyxfrtQgY4mOfdbBGXEf24XxWahxuPlXLzxnSB6H9awKM9kC2ozYIoiSC5QQdgiGoX_luUcrlo-Ddk-sdo-by161BfdqxjFGOTDA7_J1z_Gfw";

  before(async function () {
    const JWTDecoder = await ethers.getContractFactory("JWT");
    jwtDecoder = await JWTDecoder.deploy();
    await jwtDecoder.waitForDeployment();
  });

  it("should split JWT correctly", async function () {
    const [header, payload, signature] = await jwtDecoder.split(jwt);
    const [expectedHeader, expectedPayload, expectedSignature] = jwt.split(".");
    expect(header).to.equal(expectedHeader);
    expect(payload).to.equal(expectedPayload);
    expect(signature).to.equal(expectedSignature);
  });

  it("should extract kid correctly", async function () {
    const [header] = await jwtDecoder.split(jwt);
    const kid = await jwtDecoder.extractKid(header);
    expect(kid).to.equal("d25f8dbcf97dc7ec401f0171fb6e6bda9ed9e792");
  });

  it("should calculate JWT hash correctly", async function () {
    const [header, payload] = await jwtDecoder.split(jwt);
    const hash = await jwtDecoder.hashHeaderAndPayload(header, payload);
    const expectedHash = crypto
      .createHash("sha256")
      .update(`${header}.${payload}`)
      .digest();
    expect(hash).to.equal(`0x${expectedHash.toString("hex")}`);
  });

  it("should decode signature correctly", async function () {
    const [_, __, signature] = await jwtDecoder.split(jwt);
    const decodedSignature = await jwtDecoder.decodeSignature(signature);
    const expectedSignature = `0x${Buffer.from(signature, "base64").toString(
      "hex"
    )}`;
    expect(decodedSignature).to.equal(expectedSignature);
  });
});
