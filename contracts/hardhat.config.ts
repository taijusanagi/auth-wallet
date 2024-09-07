import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// hardhat default account #0
export const defaultSignerPrivateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const accounts = [process.env.PRIVATE_KEY || defaultSignerPrivateKey];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: "https://sepolia.base.org",
      },
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts,
    },
  },
};

export default config;
