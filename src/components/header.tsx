'use client'

import React, { FC, useCallback, useState } from 'react'
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

const NavLink: FC<NavLinkProps> = ({ href, currentPath, children }) => (
  <Link
    href={href}
    className={`
      px-3 py-2 rounded-md transition-colors duration-200
      ${
        currentPath === href || currentPath.startsWith(href)
          ? 'bg-green-100 text-green-700 font-semibold'
          : 'text-gray-700 hover:bg-gray-100'
      }
    `}
  >
    {children}
  </Link>
)

const CustomConnectButton: FC = () => (
  <ConnectKitButton.Custom>
    {({ show }) => {
      return (
        <button
          onClick={show}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold'
        >
          Connect Wallet
        </button>
      )
    }}
  </ConnectKitButton.Custom>
)

const Header: FC<HeaderProps> = ({ isStatusBarVisible }) => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const { isConnected } = useAccount()
  const pathname = usePathname()

  const handlePurchaseTicket = useCallback(() => {
    setIsGameModalOpen(true)
  }, [])

  return (
    <>
      <header
        className={`
          z-10 bg-white h-20 fixed left-0 right-0 shadow-md transition-all duration-300
          ${isStatusBarVisible ? 'top-12' : 'top-0'}
        `}
      >
        <div className='container mx-auto h-full px-4 flex items-center justify-between'>
          <Link href='/' className='h-full flex items-center'>
            <img
              src='/logo.png'
              alt='Eat The Pie Lottery'
              className='w-12 md:w-14 transition-transform duration-200 hover:scale-105'
            />
          </Link>
          <nav className='flex items-center space-x-2 md:space-x-4'>
            <NavLink href='/rules' currentPath={pathname}>
              Rules
            </NavLink>
            <NavLink href='/results' currentPath={pathname}>
              Results
            </NavLink>
            {isConnected ? (
              <WalletDropdown purchaseTicket={handlePurchaseTicket} />
            ) : (
              <CustomConnectButton />
            )}
          </nav>
        </div>
      </header>
      {isGameModalOpen && <GameModal onRequestClose={() => setIsGameModalOpen(false)} />}
    </>
  )
}

export default Header
