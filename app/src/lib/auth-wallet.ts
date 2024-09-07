import { Wallet, getWalletConnectConnector } from "@rainbow-me/rainbowkit";

export const authWallet = ({ projectId }: { projectId: string }): Wallet => ({
  id: "auth-wallet",
  name: "Auth Wallet",
  iconUrl: "./oauth.png",
  iconBackground: "",
  createConnector: getWalletConnectConnector({ projectId }),
});
