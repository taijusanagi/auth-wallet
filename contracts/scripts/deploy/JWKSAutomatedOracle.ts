import { ethers } from "hardhat";

import { baseSepoliaChainlinkConfig } from "../../chainlinkConfig";

export const main = async () => {
  const JWKSAutomatedOracle = await ethers.getContractFactory(
    "JWKSAutomatedOracle"
  );
  const jwksAutomatedOracle = await JWKSAutomatedOracle.deploy(
    baseSepoliaChainlinkConfig.router,
    baseSepoliaChainlinkConfig.donId,
    baseSepoliaChainlinkConfig.subscriptionId,
    baseSepoliaChainlinkConfig.gasLimit
  );
  await jwksAutomatedOracle.waitForDeployment();
  const jwksAutomatedOracleAddress = await jwksAutomatedOracle.getAddress();
  console.log("JWKSAutomatedOracle deployed to:", jwksAutomatedOracleAddress);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
