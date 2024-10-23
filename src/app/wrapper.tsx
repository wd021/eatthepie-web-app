'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Header, RecentPurchases, StatusBar } from '@/components'
import { Ethereum, LinkArrow } from '@/icons'
import { BLOCK_EXPLORER_LINKS, NETWORK_NAMES } from '@/utils/constants'
import { trimAddress } from '@/utils/helpers'

interface WrapperProps {
  children: React.ReactNode
}

interface FooterProps {
  networkName: NetworkName
  lotteryAddress: string
}

type NetworkName = keyof typeof NETWORK_NAMES

const BlockExplorerLink: React.FC<FooterProps> = ({ networkName, lotteryAddress }) => {
  const explorerUrl = 'https://www.google.com'
  return (
    <a
      href={explorerUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='text-gray-600 font-semibold hover:text-green-600 transition-colors duration-200'
    >
      View Contract on Etherscan
    </a>
  )
}

const Navigation: React.FC = () => (
  <nav className='h-[50px] text-sm sm:text-base flex items-center justify-center'>
    <a
      href='https://docs.eatthepie.xyz'
      target='_blank'
      rel='noopener noreferrer'
      className='hover:text-green-600 transition-colors duration-200'
    >
      Docs
    </a>
    <span className='mx-2 text-gray-400'>·</span>
    <a
      href='https://github.com/eatthepie'
      target='_blank'
      rel='noopener noreferrer'
      className='hover:text-green-600 transition-colors duration-200'
    >
      Github
    </a>
    <span className='mx-2 text-gray-400'>·</span>
    <Link href='/mirrors' className='hover:text-green-600 transition-colors duration-200'>
      Mirrors
    </Link>
    <span className='mx-2 text-gray-400'>·</span>
    <span className='text-gray-600'>⚠️ Responsible Gaming</span>
  </nav>
)

const Footer: React.FC<FooterProps> = ({ networkName, lotteryAddress }) => (
  <footer className='bg-white border-t border-gray-200 py-4 mt-auto'>
    <div className='container mx-auto px-4'>
      <div className='flex flex-col items-center'>
        <BlockExplorerLink networkName={networkName} lotteryAddress={lotteryAddress} />
        <Navigation />
      </div>
    </div>
  </footer>
)

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true)

  const networkName: NetworkName =
    (process.env.NEXT_PUBLIC_NETWORK_NAME as NetworkName) ?? 'mainnet'
  const lotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS ?? ''

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className='min-h-screen flex flex-col'>
      <StatusBar
        isStatusBarVisible={isStatusBarVisible}
        setIsStatusBarVisible={setIsStatusBarVisible}
      />
      <Header isStatusBarVisible={isStatusBarVisible} />
      <main className={`flex-grow ${isStatusBarVisible ? 'mt-32' : 'mt-20'}`}>{children}</main>
      <Footer networkName={networkName} lotteryAddress={lotteryAddress} />
      <RecentPurchases />
    </div>
  )
}

export default Wrapper
