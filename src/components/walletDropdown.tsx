'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'

import { Cart, PowerOff, Receipt, Wallet } from '@/icons'
import { trimAddress } from '@/utils/helpers'

interface WalletDropdownProps {
  purchaseTicket: () => void
}

interface DropdownItemProps {
  onClick: () => void
  icon: React.ReactNode
  text: string
}

const DropdownItem: React.FC<DropdownItemProps> = ({ onClick, icon, text }) => (
  <button
    onClick={onClick}
    className='flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
    role='menuitem'
  >
    {icon}
    {text}
  </button>
)

const WalletDropdown: React.FC<WalletDropdownProps> = ({ purchaseTicket }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  const handleBuyTickets = useCallback(() => {
    purchaseTicket()
    setIsOpen(false)
  }, [purchaseTicket])

  const handleWalletHistory = useCallback(() => {
    setIsOpen(false)
    router.push(`/wallet/${address}`)
  }, [address, router])

  const handleDisconnect = useCallback(() => {
    disconnect()
    setIsOpen(false)
  }, [disconnect])

  const dropdownItems = [
    {
      onClick: handleBuyTickets,
      icon: <Cart />,
      text: 'Buy Tickets',
    },
    {
      onClick: handleWalletHistory,
      icon: <Receipt />,
      text: 'Wallet History',
    },
    {
      onClick: handleDisconnect,
      icon: <PowerOff />,
      text: 'Disconnect',
    },
  ]

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        className='flex px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Wallet className='w-6 h-6 text-white' />
        <div className='ml-2'>{address ? trimAddress(address) : ''}</div>
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            {dropdownItems.map((item, index) => (
              <DropdownItem key={index} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletDropdown
