'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createConfig, fallback, http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

const CONNECT_KIT_THEME = {
  '--ck-connectbutton-font-size': '16px',
  '--ck-font-family': 'Montserrat',
  '--ck-connectbutton-border-radius': '100px',
  '--ck-connectbutton-color': '#fff',
  '--ck-connectbutton-background': '#1f2937',
  '--ck-connectbutton-hover-color': '#fff',
  '--ck-connectbutton-hover-background': '#1f2937',
  '--ck-connectbutton-active-color': '#fff',
  '--ck-connectbutton-active-background': '#1f2937',
} as const

const APP_CONFIG = {
  appName: 'Eat The Pie - The World Lottery',
  appDescription:
    'A revolutionary lottery that runs itself, secured by math, powered by Ethereum. Low 1% fees mean bigger wins for everyone.',
  appUrl: 'https://www.eatthepie.xyz',
  appIcon: 'https://www.eatthepie.xyz/logo.png',
} as const

const getSelectedChain = () => {
  const selectedChain = process.env.NEXT_PUBLIC_LOTTERY_NETWORK || 'mainnet'
  return selectedChain === 'mainnet' ? mainnet : sepolia
}

const configureRpcs = () => {
  const mainnetRpcs = [
    http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC!),
    http(process.env.NEXT_PUBLIC_INFURA_MAINNET_RPC!),
    http(process.env.NEXT_PUBLIC_QUICKNODE_MAINNET_RPC!),
    http(mainnet.rpcUrls.default.http[0]),
  ]

  const sepoliaRpcs = [
    http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC!),
    http(process.env.NEXT_PUBLIC_INFURA_SEPOLIA_RPC!),
    http(process.env.NEXT_PUBLIC_QUICKNODE_SEPOLIA_RPC!),
    http(sepolia.rpcUrls.default.http[0]),
  ]

  return {
    mainnetRpcs,
    sepoliaRpcs,
  }
}

const createProviderConfig = () => {
  const chain = getSelectedChain()
  const { mainnetRpcs, sepoliaRpcs } = configureRpcs()

  return createConfig(
    getDefaultConfig({
      chains: [chain],
      transports: {
        [mainnet.id]: fallback(mainnetRpcs),
        [sepolia.id]: fallback(sepoliaRpcs),
        // [foundry.id]: http('http://127.0.0.1:8545'),
      },
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      ...APP_CONFIG,
    }),
  )
}

const queryClient = new QueryClient()

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const config = createProviderConfig()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={CONNECT_KIT_THEME}>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
