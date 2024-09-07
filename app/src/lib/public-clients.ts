import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const publicClients = {
  "84532": createPublicClient({
    chain: baseSepolia,
    transport: http(),
  }),
};
