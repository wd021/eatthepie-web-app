import type { Metadata } from 'next'

import { ToastProvider } from '@/providers/ToastProvider'
import { Web3Provider } from '@/providers/Web3Provider'

import Wrapper from './wrapper'

import './globals.css'

export const metadata: Metadata = {
  title: 'Eat The Pie - The World Lottery',
  description: "The world's first fully autonomous and trustless lottery running on Ethereum.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <Web3Provider>
        <body>
          <ToastProvider>
            <Wrapper>{children}</Wrapper>
          </ToastProvider>
        </body>
      </Web3Provider>
    </html>
  )
}
