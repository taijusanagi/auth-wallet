import { expect } from "chai";
import { ethers } from "hardhat";
import { AuthWallet, JWKSAutomatedOracleMock } from "../typechain-types";
import { jwt, kid, modulus } from "./data/jwt";

describe("AuthWallet", function () {
  let authWallet: AuthWallet;
  let jwksAutomatedOracleMock: JWKSAutomatedOracleMock;

  before(async function () {
    const JWKSAutomatedOracleMockFactory = await ethers.getContractFactory(
      "JWKSAutomatedOracleMock"
    );
    jwksAutomatedOracleMock = await JWKSAutomatedOracleMockFactory.deploy();
    await jwksAutomatedOracleMock.waitForDeployment();
    const jwksAutomatedOracleMockAddress =
      await jwksAutomatedOracleMock.getAddress();
    const AuthWalletFactory = await ethers.getContractFactory("AuthWallet");
    authWallet = await AuthWalletFactory.deploy(jwksAutomatedOracleMockAddress);
    await authWallet.waitForDeployment();
  });

  it("should validate JWT correctly", async function () {
    await jwksAutomatedOracleMock.setModulus(kid, modulus);
    const isValid = await authWallet.validateJWT(jwt);
    expect(isValid).to.be.true;
  });
});
