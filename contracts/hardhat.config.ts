import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@nomicfoundation/hardhat-verify";

import { defaultSignerPrivateKey } from "./key";

const accounts = [process.env.PRIVATE_KEY || defaultSignerPrivateKey];

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    hardhat: {
      forking: {
        url: "https://sepolia.base.org",
      },
    },
    "optimism-sepolia": {
      url: "https://sepolia.optimism.io",
      accounts,
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts,
    },
  },
  etherscan: {
    apiKey:
      process.env.ETHERSCAN_API_KEY || "BS56RJPCFREESF68WMCV487FT3VII2QZQT",
  },
};

export default config;
