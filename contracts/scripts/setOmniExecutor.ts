import { network, ethers } from "hardhat";

import { deployedContractAddress } from "../deployedContractAddress";
import { baseSepoliaEid, optimismSepoliaEid } from "../layerZeroConfig";

export const main = async () => {
  let eid;
  if (network.name === "optimism-sepolia") {
    eid = baseSepoliaEid;
  } else if (network.name === "base-sepolia") {
    eid = optimismSepoliaEid;
  } else {
    throw new Error("Unsupported network");
  }
  const omniExecutor = await ethers.getContractAt(
    "OmniExecutor",
    deployedContractAddress.OmniExecutor
  );
  await omniExecutor.setPeer(eid, deployedContractAddress.OmniExecutor);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
