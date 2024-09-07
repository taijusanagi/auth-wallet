import { appId, appName, chainId } from "./constant";
import { AuthWalletProvider } from "./provider";

const provider = new AuthWalletProvider();

export const authWalletConnector = () => {
  let isConnecting = false;

  return (config: any) => {
    return {
      id: `${appId}-connector`,
      name: `${appName} Connector`,
      type: "",

      async connect() {
        if (!isConnecting) {
          throw new Error("Not connecting");
        }
        isConnecting = false;
        await provider.init();
        const accounts = await provider.request({ method: "eth_accounts" });
        return { accounts, chainId };
      },

      async disconnect() {},

      async getAccounts() {
        const accounts = await provider.request({ method: "eth_accounts" });
        return accounts;
      },

      async getChainId() {
        isConnecting = true;
        return await provider.request({ method: "eth_chainId" });
      },

      async getProvider() {
        return provider;
      },

      async isAuthorized() {
        return true;
      },

      async switchChain({ chainId }: { chainId: number }) {
        const chain = config.chains.find((chain: any) => chain.id === chainId);
        if (!chain) {
          throw new Error(`Chain with ID ${chainId} not found`);
        }
        return chain;
      },

      onAccountsChanged(accounts: string[]) {},

      onChainChanged(chainId: string) {},

      onDisconnect(error?: Error) {},
    };
  };
};
