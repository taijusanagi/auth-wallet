import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

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
};

export default config;
