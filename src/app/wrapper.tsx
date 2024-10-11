'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { ActivityFeed, Header, StatusBar } from '@/components'
import { Ethereum, LinkArrow } from '@/icons'
import { BLOCK_EXPLORER_LINKS, NETWORK_NAMES } from '@/utils/constants'
import { trimAddress } from '@/utils/helpers'

interface WrapperProps {
  children: React.ReactNode
}

type NetworkName = keyof typeof NETWORK_NAMES

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true)

  const networkName: NetworkName =
    (process.env.NEXT_PUBLIC_NETWORK_NAME as NetworkName) ?? 'mainnet'
  const lotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS ?? ''

  // remove ssr for hydration error
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className='min-h-screen'>
      <StatusBar
        isStatusBarVisible={isStatusBarVisible}
        setIsStatusBarVisible={setIsStatusBarVisible}
      />
      <Header isStatusBarVisible={isStatusBarVisible} />
      <div className={`mb-[100px] ${isStatusBarVisible ? 'mt-[145px]' : 'mt-[75px]'}`}>
        {children}
      </div>
      <footer className='fixed bottom-0 flex flex-col h-[100px] w-full items-center justify-center bg-gray-100 border-t border-gray-200'>
        <a
          href={`${BLOCK_EXPLORER_LINKS[networkName]}address/${lotteryAddress}`}
          target='_blank'
          className='h-[50px] text-lg flex items-center justify-center underline font-semibold cursor-pointer'
        >
          <Ethereum className='w-5 h-5 mr-1' />
          <div>
            {NETWORK_NAMES[networkName]}: {trimAddress(lotteryAddress, 6, 6)}
          </div>
          <LinkArrow className='w-8 h-8' />
        </a>
        <nav className='h-[50px] text-sm sm:text-base'>
          <a href='https://docs.eatthepie.xyz' target='_blank'>
            Docs
          </a>
          <span className='mx-2 text-gray-400'>·</span>
          <a href='https://github.com/eatthepie' target='_blank'>
            Github
          </a>
          <span className='mx-2 text-gray-400'>·</span>
          <Link href='/mirrors' target='_blank'>
            Mirrors
          </Link>
          <span className='mx-2 text-gray-400'>·</span>
          <span>Responsible Gambling</span>
        </nav>
      </footer>
      <ActivityFeed />
    </div>
  )
}

export default Wrapper
