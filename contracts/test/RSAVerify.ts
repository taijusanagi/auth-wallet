import { expect } from "chai";
import { ethers } from "hardhat";

describe("JWTRSAVerification", function () {
  let jwtRSAVerification: any;

  beforeEach(async function () {
    const JWTRSAVerificationFactory = await ethers.getContractFactory(
      "JWTRSAVerification"
    );
    jwtRSAVerification = await JWTRSAVerificationFactory.deploy();
    await jwtRSAVerification.waitForDeployment();
  });

  it("should verify a valid JWT RSA signature", async function () {
    // Using small prime numbers for modulus
    const p = 61n;
    const q = 53n;
    const modulus = p * q; // 3233
    const exponent = 17n; // Common small public exponent

    // Choose a small number as our "message hash"
    const messageNumber = 65n;

    // Convert the message number to bytes32
    const message = ethers.zeroPadValue(ethers.toBeHex(messageNumber), 32);

    // Calculate signature: message^(1/exponent) mod modulus
    // In RSA, this is typically done with the private key
    // We're simulating it by finding a number that, when exponentiated, equals our message
    let signature = 0n;
    for (let i = 1n; i < modulus; i++) {
      if (i ** exponent % modulus === messageNumber) {
        signature = i;
        break;
      }
    }

    console.log("Message:", messageNumber.toString());
    console.log("Signature:", signature.toString());
    console.log("Modulus:", modulus.toString());
    console.log("Exponent:", exponent.toString());

    const result = await jwtRSAVerification.verify(
      message,
      signature,
      exponent,
      modulus
    );

    console.log("Verification result:", result);

    expect(result).to.equal(true);
  });
});
