import { network, ethers } from "hardhat";

import { deployedContractAddress } from "../deployedContractAddress";
import { baseSepoliaEid, optimismSepoliaEid } from "../layerZeroConfig";

function addressToBytes32JS(addr: string) {
  const addressWithoutPrefix = addr.startsWith("0x") ? addr.slice(2) : addr;
  const paddedAddress = "0".repeat(24) + addressWithoutPrefix;
  return "0x" + paddedAddress;
}

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
  await omniExecutor.setPeer(
    eid,
    addressToBytes32JS(deployedContractAddress.OmniExecutor)
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
