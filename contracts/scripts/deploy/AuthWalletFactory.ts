import { ethers } from "hardhat";

import { entryPointAddress } from "../../externalContractAddress";
import { baseSepoliaDeployedContractAddress } from "../../deployedContractAddress";

export const main = async () => {
  const AuthWalletFactory = await ethers.getContractFactory(
    "AuthWalletFactory"
  );
  const authWalletFactory = await AuthWalletFactory.deploy(
    entryPointAddress,
    baseSepoliaDeployedContractAddress.JWKSAutomatedOracle
  );
  await authWalletFactory.waitForDeployment();
  const authWalletFactoryAddress = await authWalletFactory.getAddress();
  console.log("AuthWalletFactory deployed to:", authWalletFactoryAddress);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
