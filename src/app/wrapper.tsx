'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Header, RecentPurchases, StatusBar } from '@/components'
import { Responsible } from '@/components/modals'
import { NETWORK_NAMES } from '@/utils/constants'

type NetworkName = keyof typeof NETWORK_NAMES

const EXTERNAL_LINKS = {
  DOCS: 'https://docs.eatthepie.xyz',
  GITHUB: 'https://github.com/eatthepie',
  LINKS: 'https://docs.eatthepie.xyz/links/main',
} as const

const NAV_ITEMS = [
  { type: 'link', href: EXTERNAL_LINKS.DOCS, label: 'Docs', isExternal: true },
  { type: 'link', href: EXTERNAL_LINKS.GITHUB, label: 'Github', isExternal: true },
  { type: 'link', href: EXTERNAL_LINKS.LINKS, label: 'Links', isExternal: true },
  { type: 'action', label: '⚠️ Responsible Gaming', action: 'showResponsibleModal' },
] as const

const Navigation: React.FC<{ showResponsibleModal: () => void }> = ({
  showResponsibleModal,
}) => {
  const renderNavItem = (item: (typeof NAV_ITEMS)[number]) => {
    const commonClasses = 'hover:text-green-600 transition-colors duration-200'

    if (item.type === 'action') {
      return (
        <span className='hover:text-green-600 cursor-pointer' onClick={showResponsibleModal}>
          {item.label}
        </span>
      )
    }

    if (item.isExternal) {
      return (
        <a href={item.href} target='_blank' rel='noopener noreferrer' className={commonClasses}>
          {item.label}
        </a>
      )
    }

    return (
      <Link key={item.href} href={item.href} className={commonClasses}>
        {item.label}
      </Link>
    )
  }

  return (
    <nav className='text-sm sm:text-base w-full'>
      <div className='flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0'>
        <div className='flex items-center justify-center'>
          {renderNavItem(NAV_ITEMS[0])}
          <span className='mx-2 text-gray-400'>·</span>
          {renderNavItem(NAV_ITEMS[1])}
        </div>
        <span className='hidden md:flex mx-2 text-gray-400'>·</span>
        <div className='flex items-center justify-center'>
          {renderNavItem(NAV_ITEMS[2])}
          <span className='mx-2 text-gray-400'>·</span>
          {renderNavItem(NAV_ITEMS[3])}
        </div>
      </div>
    </nav>
  )
}

const Footer: React.FC<{
  networkName: NetworkName
  lotteryAddress: string
  showResponsibleModal: () => void
}> = ({ showResponsibleModal }) => (
  <footer className='bg-white border-t border-gray-200 py-4 mt-auto'>
    <div className='container mx-auto px-4'>
      <Navigation showResponsibleModal={showResponsibleModal} />
    </div>
  </footer>
)

const getEnvironmentVariables = () => {
  const networkName = process.env.NEXT_PUBLIC_LOTTERY_NETWORK as NetworkName
  const lotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS ?? ''

  return {
    networkName: networkName ?? 'mainnet',
    lotteryAddress,
  }
}

const DeprecatedNotice: React.FC = () => (
  <div className='bg-yellow-100 border-b border-yellow-200 p-4 h-20 flex items-center'>
    <div className='container mx-auto px-4'>
      <p className='text-center text-yellow-800'>
        ⚠️ This version is deprecated. Please visit{' '}
        <a
          href='https://www.eatthepie.xyz'
          className='underline font-medium hover:text-yellow-900'
          target='_blank'
          rel='noopener noreferrer'
        >
          www.eatthepie.xyz
        </a>{' '}
        for the latest version.
      </p>
    </div>
  </div>
)

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false)
  const { networkName, lotteryAddress } = getEnvironmentVariables()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleResponsibleModalOpen = () => setIsResponsibleModalOpen(true)
  const handleResponsibleModalClose = () => setIsResponsibleModalOpen(false)

  // Early return for SSR
  if (!isClient) return null

  return (
    <div className='min-h-screen flex flex-col'>
      <DeprecatedNotice />
      <Header isStatusBarVisible={true} />
      <main className={`flex-grow mt-40`}>{children}</main>
      <Footer
        networkName={networkName}
        lotteryAddress={lotteryAddress}
        showResponsibleModal={handleResponsibleModalOpen}
      />
      <RecentPurchases />
      {isResponsibleModalOpen && <Responsible onRequestClose={handleResponsibleModalClose} />}
    </div>
  )
}

export default Wrapper
