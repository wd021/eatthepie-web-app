'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import { Header, RecentPurchases, StatusBar } from '@/components'
import { Responsible } from '@/components/modals'
import { NETWORK_NAMES } from '@/utils/constants'

type NetworkName = keyof typeof NETWORK_NAMES

const EXTERNAL_LINKS = {
  DOCS: 'https://docs.eatthepie.xyz',
  GITHUB: 'https://github.com/eatthepie',
} as const

const NAV_ITEMS = [
  { type: 'link', href: EXTERNAL_LINKS.DOCS, label: 'Docs', isExternal: true },
  { type: 'link', href: EXTERNAL_LINKS.GITHUB, label: 'Github', isExternal: true },
  { type: 'link', href: '/resources', label: 'Resources', isExternal: false },
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
    <nav className='h-[50px] text-sm sm:text-base flex items-center justify-center'>
      {NAV_ITEMS.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span className='mx-2 text-gray-400'>·</span>}
          {renderNavItem(item)}
        </Fragment>
      ))}
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
      <div className='flex flex-col items-center'>
        <Navigation showResponsibleModal={showResponsibleModal} />
      </div>
    </div>
  </footer>
)

const getEnvironmentVariables = () => {
  const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME as NetworkName
  const lotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS ?? ''

  return {
    networkName: networkName ?? 'mainnet',
    lotteryAddress,
  }
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true)
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
      <StatusBar
        isStatusBarVisible={isStatusBarVisible}
        setIsStatusBarVisible={setIsStatusBarVisible}
      />
      <Header isStatusBarVisible={isStatusBarVisible} />
      <main className={`flex-grow ${isStatusBarVisible ? 'mt-32' : 'mt-20'}`}>{children}</main>
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
