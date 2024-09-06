import { expect } from "chai";
import { ethers } from "hardhat";
import crypto from "crypto";

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
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicExponent: 65537,
    });

    const message =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0";
    const messageHash = crypto.createHash("sha256").update(message).digest();

    // Create signature with PKCS#1 v1.5 padding
    const signature = crypto.privateEncrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      messageHash
    );

    const publicKeyData = publicKey.export({
      format: "jwk",
    });

    const modulus = Buffer.from(publicKeyData.n!, "base64url");
    const exponent = Buffer.from(publicKeyData.e!, "base64url");

    console.log("Message Hash:", messageHash.toString("hex"));
    console.log("Signature:", signature.toString("hex"));
    console.log("Modulus:", modulus.toString("hex"));
    console.log("Exponent:", exponent.toString("hex"));

    const result = await jwtRSAVerification.verify(
      "0x" + messageHash.toString("hex"),
      signature,
      exponent,
      modulus
    );

    console.log("Verification result:", result);

    expect(result).to.equal(true);
  });
});
