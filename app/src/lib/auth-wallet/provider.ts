import { Address, EIP1193EventMap, EIP1193Provider, Hex } from "viem";
import { handlePopup } from "./popup";
import { chainId } from "./constant";

export class AuthWalletProvider implements EIP1193Provider {
  address?: Address;

  on<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event]
  ): void {
    throw new Error(`on is not implemented`);
  }

  removeListener<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event]
  ): void {
    throw new Error(`removeListener is not implemented`);
  }

  async init() {
    this.address = await handlePopup("connect", "address");
  }

  async request(args: { method: string; params?: unknown }): Promise<any> {
    switch (args.method) {
      case "eth_chainId":
        return chainId;
      case "eth_accounts":
        return this.address ? [this.address] : [];
      case "eth_sendTransaction":
        const [transaction] = args.params as Array<{
          from: Address;
          to: Address;
          value: Hex;
          data?: Hex;
        }>;
        return handlePopup("sendTransaction", "transactionHash", {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data,
        });
      default:
        throw new Error(
          `Request rethod:${args.method} not implemented in CustomProvider`
        );
    }
  }
}
