'use client'

import { ToastProvider } from '@/providers/ToastProvider'
import { Web3Provider } from '@/providers/Web3Provider'

import Wrapper from './wrapper'

import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <title>Eat The Pie - The World Lottery on World Chain</title>
        <meta
          name='description'
          content='A revolutionary lottery that runs itself, secured by math, powered by Ethereum. Low 1% fees mean bigger wins for everyone.'
        />
        <meta name='format-detection' content='telephone=no, date=no' />
      </head>
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
