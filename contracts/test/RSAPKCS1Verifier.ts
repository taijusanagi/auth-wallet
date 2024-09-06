import { expect } from "chai";
import { ethers } from "hardhat";
import crypto from "crypto";

describe("RSAPKCS1Verifier", function () {
  it("should verify a valid RSA KCS1 signature", async function () {
    const RSAPKCS1Verifier = await ethers.getContractFactory(
      "RSAPKCS1Verifier"
    );
    const rsaPKCS1Verifier: any = await RSAPKCS1Verifier.deploy();
    await rsaPKCS1Verifier.waitForDeployment();

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicExponent: 65537,
    });

    const message = "message";
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

    if (!publicKeyData.n || !publicKeyData.e) {
      throw new Error("Invalid public key data");
    }

    const modulus = Buffer.from(publicKeyData.n, "base64");
    const exponent = Buffer.from(publicKeyData.e, "base64");

    const result = await rsaPKCS1Verifier.verify(
      messageHash,
      signature,
      exponent,
      modulus
    );

    expect(result).to.equal(true);
  });
});
