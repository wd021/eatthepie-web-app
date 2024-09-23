"use client";

import React, { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

interface Web3ProviderProps {
  children: ReactNode;
}

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
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
