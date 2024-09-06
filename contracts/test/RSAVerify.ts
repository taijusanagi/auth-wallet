import { expect } from "chai";
import { ethers } from "hardhat";

describe("RSAVerification", function () {
  let rsaVerification: any;

  beforeEach(async function () {
    const RSAVerificationFactory = await ethers.getContractFactory(
      "RSAVerification"
    );
    rsaVerification = await RSAVerificationFactory.deploy();
    await rsaVerification.waitForDeployment();
  });

  it("should verify a valid RSA signature", async function () {
    const modulus = ethers.toBigInt("3233"); // p = 61, q = 53
    const C = ethers.toBigInt("2790");
    const c = ethers.toBigInt("17");
    const h = ethers.toBigInt("1");
    const z = ethers.toBigInt("0");
    const g = ethers.toBigInt("1");
    const l = ethers.toBigInt("0");

    // Calculate D using JavaScript's built-in modular exponentiation
    function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
      let result = 1n;
      base = base % modulus;
      while (exponent > 0n) {
        if (exponent % 2n === 1n) {
          result = (result * base) % modulus;
        }
        exponent = exponent / 2n;
        base = (base * base) % modulus;
      }
      return result;
    }

    const D = modPow(C, c, modulus);

    console.log("Calculated D:", D.toString());

    const result = await rsaVerification.verify(D, C, c, h, z, g, l, modulus);
    console.log("Verification result:", result);

    expect(result).to.equal(true);
  });
});
