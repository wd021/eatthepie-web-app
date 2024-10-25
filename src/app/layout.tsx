import type { Metadata } from 'next'

import { ToastProvider } from '@/providers/ToastProvider'
import { Web3Provider } from '@/providers/Web3Provider'

import Wrapper from './wrapper'

import './globals.css'

export const metadata: Metadata = {
  title: 'Eat The Pie - The World Lottery',
  description:
    'A revolutionary lottery that runs itself, secured by math, powered by Ethereum. Low 1% fees mean bigger wins for everyone.',
  other: {
    'format-detection': 'telephone=no, date=no',
  },
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
