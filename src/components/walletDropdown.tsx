'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'

import { Cart, PowerOff, Prize, Receipt, Wallet } from '@/icons'
import { trimAddress } from '@/utils/helpers'

interface WalletDropdownProps {
  purchaseTicket: () => void | Promise<void>
}

interface DropdownItemProps {
  onClick: () => void
  icon: React.ReactNode
  text: string
}

interface DropdownAction {
  id: string
  icon: React.ReactNode
  text: string
  action: (closeDropdown: () => void) => void
}

const STYLES = {
  container: 'relative',
  walletButton:
    'flex px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold',
  walletIcon: 'w-6 h-6 text-white',
  addressText: 'ml-2',
  dropdown:
    'absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5',
  dropdownMenu: 'py-1',
  menuItem: 'flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100',
} as const

const DropdownItem: React.FC<DropdownItemProps> = ({ onClick, icon, text }) => (
  <button onClick={onClick} className={STYLES.menuItem} role='menuitem'>
    {icon}
    {text}
  </button>
)

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, handler])
}

const useDropdownActions = (purchaseTicket: () => void | Promise<void>) => {
  const router = useRouter()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()

  return useCallback(
    (closeDropdown: () => void): DropdownAction[] => [
      {
        id: 'buy-tickets',
        icon: <Cart />,
        text: 'Buy Tickets',
        action: () => {
          purchaseTicket()
          closeDropdown()
        },
      },
      {
        id: 'purchase-history',
        icon: <Receipt />,
        text: 'Purchase History',
        action: () => {
          router.push(`/wallet/${address}`)
          closeDropdown()
        },
      },
      {
        id: 'claim-prize',
        icon: <Prize />,
        text: 'Claim Prize',
        action: () => {
          router.push(`/claim/${address}`)
          closeDropdown()
        },
      },
      {
        id: 'disconnect',
        icon: <PowerOff />,
        text: 'Disconnect',
        action: () => {
          disconnect()
          closeDropdown()
        },
      },
    ],
    [purchaseTicket, router, address, disconnect],
  )
}

const WalletDropdown: React.FC<WalletDropdownProps> = ({ purchaseTicket }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { address } = useAccount()
  const getDropdownActions = useDropdownActions(purchaseTicket)
  const handleClose = useCallback(() => setIsOpen(false), [])
  useClickOutside(dropdownRef, handleClose)
  const dropdownActions = getDropdownActions(handleClose)

  return (
    <div className={STYLES.container} ref={dropdownRef}>
      <button
        className={STYLES.walletButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <Wallet className={STYLES.walletIcon} />
        <div className={STYLES.addressText}>{address ? trimAddress(address) : ''}</div>
      </button>

      {isOpen && (
        <div className={STYLES.dropdown}>
          <div
            className={STYLES.dropdownMenu}
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='wallet-menu'
          >
            {dropdownActions.map(({ id, icon, text, action }) => (
              <DropdownItem
                key={id}
                icon={icon}
                text={text}
                onClick={() => action(handleClose)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletDropdown
