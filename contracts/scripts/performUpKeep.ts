import { ethers } from "hardhat";

import { baseSepoliaDeployedContractAddress } from "../deployedContractAddress";

export const main = async () => {
  const jwksAutomatedOracle = await ethers.getContractAt(
    "JWKSAutomatedOracle",
    baseSepoliaDeployedContractAddress.JWKSAutomatedOracle
  );
  const tx = await jwksAutomatedOracle.performUpkeep("0x");
  await tx.wait();
  console.log("Upkeep performed", tx.hash);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
