'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createConfig, fallback, http, WagmiProvider } from 'wagmi'
import { foundry, mainnet, sepolia } from 'wagmi/chains'

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

const getRpcUrls = (providers: string[], defaultRpc: string) => {
  const urls = providers
    .map((provider) => process.env[`NEXT_PUBLIC_${provider}_RPC`])
    .filter(Boolean)
    .map((url) => http(url as string))

  urls.push(http(defaultRpc))
  return urls
}

const getSelectedChain = () => {
  const selectedChain = process.env.NEXT_PUBLIC_LOTTERY_NETWORK || 'mainnet'
  return selectedChain === 'mainnet' ? mainnet : selectedChain === 'sepolia' ? sepolia : foundry
}

const configureRpcs = () => {
  const providers = ['ALCHEMY', 'INFURA', 'QUICKNODE']

  return {
    mainnetRpcs: getRpcUrls(
      providers.map((p) => `${p}_MAINNET`),
      mainnet.rpcUrls.default.http[0],
    ),
    sepoliaRpcs: getRpcUrls(
      providers.map((p) => `${p}_SEPOLIA`),
      sepolia.rpcUrls.default.http[0],
    ),
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
