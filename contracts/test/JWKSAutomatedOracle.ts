import { expect } from "chai";
import { ethers } from "hardhat";
import { JWKSAutomatedOracle } from "../typechain-types";
import { jwt, kid, modulus, nonce as expectedNonce, kid2 } from "./data/jwt";

import { baseSepoliaChainlinkConfig } from "../chainlinkConfig";

describe("JWKSAutomatedOracle", function () {
  let jwksAutomatedOracle: JWKSAutomatedOracle;

  before(async function () {
    const JWKSAutomatedOracleFactory = await ethers.getContractFactory(
      "JWKSAutomatedOracle"
    );
    jwksAutomatedOracle = await JWKSAutomatedOracleFactory.deploy(
      baseSepoliaChainlinkConfig.router,
      baseSepoliaChainlinkConfig.donId,
      baseSepoliaChainlinkConfig.subscriptionId,
      baseSepoliaChainlinkConfig.gasLimit
    );
    await jwksAutomatedOracle.waitForDeployment();
  });

  it("should extract kid", async function () {
    const [extractedKid1, extractedKid2] = await jwksAutomatedOracle.extractKid(
      Buffer.from(kid + kid2, "utf-8")
    );
    expect(extractedKid1).to.equal(kid);
    expect(extractedKid2).to.equal(kid2);
  });
});
