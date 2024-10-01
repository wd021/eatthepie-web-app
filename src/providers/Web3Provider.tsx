"use client";

import React, { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { foundry, mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

interface Web3ProviderProps {
  children: ReactNode;
}

// Retrieve the desired chain based on environment variables
const selectedChain = process.env.NEXT_PUBLIC_NETWORK_NAME || "mainnet";

// Define the chains with priority for custom RPC URLs (if provided)
const chain = (() => {
  switch (selectedChain) {
    case "mainnet":
      return {
        ...mainnet,
        rpcUrls: {
          default: {
            http: [
              `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
              ...mainnet.rpcUrls.default.http,
            ].filter(Boolean),
          },
        },
      };
    case "sepolia":
      return {
        ...sepolia,
        rpcUrls: {
          default: {
            http: [
              `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
              ...sepolia.rpcUrls.default.http,
            ].filter(Boolean),
          },
        },
      };
    case "anvil":
      return foundry;
    default:
      throw new Error(`Unsupported chain: ${selectedChain}`);
  }
})();

const config = createConfig(
  getDefaultConfig({
    chains: [chain],
    transports: {
      [chain.id]: http(chain.rpcUrls.default.http[0]), // Use the first available URL in the list
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "Eat The Pie - The World Lottery",
    appDescription:
      "The world's first fully autonomous and trustless lottery running on Ethereum.",
    appUrl: "https://eatthepie.xyz",
    appIcon: "https://www.eatthepie.xyz/logo.png",
  })
);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-connectbutton-font-size": "16px",
            "--ck-font-family": "Montserrat",
            "--ck-connectbutton-border-radius": "100px",
            "--ck-connectbutton-color": "#fff",
            "--ck-connectbutton-background": "#1f2937",
            "--ck-connectbutton-hover-color": "#fff",
            "--ck-connectbutton-hover-background": "#1f2937",
            "--ck-connectbutton-active-color": "#fff",
            "--ck-connectbutton-active-background": "#1f2937",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
