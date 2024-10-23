'use client'

import { FC, useCallback, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

import { WalletDropdown } from '@/components'
import { Game as GameModal } from '@/components/modals'

interface HeaderProps {
  isStatusBarVisible: boolean
}

interface NavLinkProps {
  href: string
  currentPath: string
  children: React.ReactNode
}

interface NavItem {
  href: string
  label: string
}

const NAVIGATION_ITEMS: NavItem[] = [
  { href: '/rules', label: 'Rules' },
  { href: '/results', label: 'Results' },
] as const

const STYLES = {
  header: {
    base: 'z-10 bg-white h-20 fixed left-0 right-0 shadow-md transition-all duration-300',
    position: {
      visible: 'top-12',
      hidden: 'top-0',
    },
  },
  navLink: {
    base: 'px-3 py-2 rounded-md transition-colors duration-200',
    active: 'bg-green-100 text-green-700 font-semibold',
    inactive: 'text-gray-700 hover:bg-gray-100',
  },
  connectButton:
    'px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold',
  logo: {
    container: 'h-full flex items-center',
    image: 'w-12 md:w-14 transition-transform duration-200 hover:scale-105',
  },
  nav: 'flex items-center space-x-2 md:space-x-4',
} as const

const NavLink: FC<NavLinkProps> = ({ href, currentPath, children }) => {
  const isActive = currentPath === href || currentPath.startsWith(href)

  return (
    <Link
      href={href}
      className={`
        ${STYLES.navLink.base}
        ${isActive ? STYLES.navLink.active : STYLES.navLink.inactive}
      `}
    >
      {children}
    </Link>
  )
}

const CustomConnectButton: FC = () => (
  <ConnectKitButton.Custom>
    {({ show }) => (
      <button onClick={show} className={STYLES.connectButton}>
        Connect Wallet
      </button>
    )}
  </ConnectKitButton.Custom>
)

const Logo: FC = () => (
  <Link href='/' className={STYLES.logo.container}>
    <img src='/logo.png' alt='Eat The Pie Lottery' className={STYLES.logo.image} />
  </Link>
)

const Navigation: FC<{
  pathname: string
  isConnected: boolean
  onPurchaseTicket: () => void
}> = ({ pathname, isConnected, onPurchaseTicket }) => (
  <nav className={STYLES.nav}>
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

const Header: FC<HeaderProps> = ({ isStatusBarVisible }) => {
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
        className={`
          ${STYLES.header.base}
          ${isStatusBarVisible ? STYLES.header.position.visible : STYLES.header.position.hidden}
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
