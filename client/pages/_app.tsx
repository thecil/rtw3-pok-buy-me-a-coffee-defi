import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import SSRProvider from "react-bootstrap/SSRProvider";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
// custom wallet list
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
// notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const { chains, provider } = configureChains(
  [chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
  {
    groupName: "Others",
    wallets: [
      argentWallet({ chains }),
      braveWallet({ chains: chains, shimDisconnect: true }),
      coinbaseWallet({ chains, appName: "Alchemy BuyMeACoffee App" }),
      trustWallet({ chains: chains, shimDisconnect: true }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ToastContainer />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </SSRProvider>
  );
}

export default MyApp;
