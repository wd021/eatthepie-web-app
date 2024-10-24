'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

import { WalletDropdown } from '@/components'
import { Game as GameModal } from '@/components/modals'

const NAVIGATION_ITEMS: {
  href: string
  label: string
}[] = [
  { href: '/rules', label: 'Rules' },
  { href: '/results', label: 'Results' },
] as const

const NavLink: React.FC<{ href: string; currentPath: string; children: React.ReactNode }> = ({
  href,
  currentPath,
  children,
}) => {
  const isActive = currentPath === href || currentPath.startsWith(href)

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      {children}
    </Link>
  )
}

const CustomConnectButton: React.FC = () => (
  <ConnectKitButton.Custom>
    {({ show }) => (
      <button
        onClick={show}
        className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold'
      >
        Connect Wallet
      </button>
    )}
  </ConnectKitButton.Custom>
)

const Logo: React.FC = () => (
  <Link href='/' className='h-full flex items-center'>
    <img
      src='/logo.png'
      alt='Eat The Pie Lottery'
      className='w-12 md:w-14 transition-transform duration-200 hover:scale-105'
    />
  </Link>
)

const Navigation: React.FC<{
  pathname: string
  isConnected: boolean
  onPurchaseTicket: () => void
}> = ({ pathname, isConnected, onPurchaseTicket }) => (
  <nav className='flex items-center space-x-2 md:space-x-4'>
    {NAVIGATION_ITEMS.map(({ href, label }) => (
      <NavLink key={href} href={href} currentPath={pathname}>
        {label}
      </NavLink>
    ))}
    {isConnected ? (
      <WalletDropdown purchaseTicket={onPurchaseTicket} />
    ) : (
      <CustomConnectButton />
    )}
  </nav>
)

const Header: React.FC<{ isStatusBarVisible: boolean }> = ({ isStatusBarVisible }) => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const { isConnected } = useAccount()
  const pathname = usePathname()

  const handlePurchaseTicket = useCallback(() => {
    setIsGameModalOpen(true)
  }, [])

  const handleCloseGameModal = useCallback(() => {
    setIsGameModalOpen(false)
  }, [])

  return (
    <>
      <header
        className={`z-10 bg-white h-20 fixed left-0 right-0 shadow-md transition-all duration-300 ${isStatusBarVisible ? 'top-12' : 'top-0'}
        `}
      >
        <div className='container mx-auto h-full px-4 flex items-center justify-between'>
          <Logo />
          <Navigation
            pathname={pathname}
            isConnected={isConnected}
            onPurchaseTicket={handlePurchaseTicket}
          />
        </div>
      </header>
      {isGameModalOpen && <GameModal onRequestClose={handleCloseGameModal} />}
    </>
  )
}

export default Header
