'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createConfig, fallback, unstable_connector, WagmiProvider } from 'wagmi'
import { foundry, mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

interface Web3ProviderProps {
  children: ReactNode
}

const selectedChain = process.env.NEXT_PUBLIC_NETWORK_NAME || 'mainnet'

const chain =
  selectedChain === 'mainnet' ? mainnet : selectedChain === 'sepolia' ? sepolia : foundry

const config = createConfig(
  getDefaultConfig({
    chains: [chain],
    connectors: [injected()],
    transports: {
      [chain.id]: fallback([unstable_connector(injected)]),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'Eat The Pie - The World Lottery',
    appDescription:
      "The world's first fully autonomous and trustless lottery running on Ethereum.",
    appUrl: 'https://eatthepie.xyz',
    appIcon: 'https://www.eatthepie.xyz/logo.png',
  }),
)

const queryClient = new QueryClient()

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            '--ck-connectbutton-font-size': '16px',
            '--ck-font-family': 'Montserrat',
            '--ck-connectbutton-border-radius': '100px',
            '--ck-connectbutton-color': '#fff',
            '--ck-connectbutton-background': '#1f2937',
            '--ck-connectbutton-hover-color': '#fff',
            '--ck-connectbutton-hover-background': '#1f2937',
            '--ck-connectbutton-active-color': '#fff',
            '--ck-connectbutton-active-background': '#1f2937',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
