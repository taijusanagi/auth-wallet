import { expect } from "chai";
import { ethers } from "hardhat";
import { AuthWallet } from "../typechain-types";
import { jwt, kid, modulus } from "./data/jwt";

describe("AuthWallet", function () {
  let authWallet: AuthWallet;

  before(async function () {
    const AuthWalletFactory = await ethers.getContractFactory("AuthWallet");
    authWallet = await AuthWalletFactory.deploy();
    await authWallet.waitForDeployment();
  });

  it("should validate JWT correctly", async function () {
    await authWallet.setModulus(kid, modulus);
    const isValid = await authWallet.validateJWT(jwt);
    expect(isValid).to.be.true;
  });
});
