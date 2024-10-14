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

const NavLink: FC<NavLinkProps> = ({ href, currentPath, children }) => (
  <Link
    href={href}
    className={
      currentPath === href || currentPath.startsWith(href) ? 'font-semibold underline' : ''
    }
  >
    {children}
  </Link>
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
        className={`z-10 bg-gray-100 h-[75px] fixed left-0 right-0 border-b border-gray-200 ${
          isStatusBarVisible ? 'top-[70px]' : 'top-0'
        }`}
      >
        <div className='flex items-center justify-between h-full px-4'>
          <Link href='/' className='h-full flex items-center'>
            <img
              src='/logo.png'
              alt='Eat The Pie Lottery'
              className='w-[54px] h-[40px] md:w-[74px] md:h-[55px]'
            />
          </Link>
          <nav className='text-lg'>
            <div className='flex items-center space-x-4'>
              <NavLink href='/rules' currentPath={pathname}>
                Rules
              </NavLink>
              <NavLink href='/results' currentPath={pathname}>
                Results
              </NavLink>
              {isConnected ? (
                <WalletDropdown purchaseTicket={handlePurchaseTicket} />
              ) : (
                <ConnectKitButton />
              )}
            </div>
          </nav>
        </div>
      </header>
      {isGameModalOpen && <GameModal onRequestClose={() => setIsGameModalOpen(false)} />}
    </>
  )
}

export default Header
