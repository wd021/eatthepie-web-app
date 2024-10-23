'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { useTicketHistory } from '@/hooks'
import { Close, ExternalLink, Ticket } from '@/icons'
import { Ticket as TicketType } from '@/utils/types'

const formatNumbers = (numbers: number[]): string => {
  return numbers.map((num) => num.toString().padStart(2, '0')).join(' - ')
}

const TicketItem: React.FC<{ ticket: TicketType }> = ({ ticket }) => (
  <div className='border-b border-gray-200 last:border-b-0 py-3 hover:bg-gray-50 transition-colors duration-150'>
    <div className='flex justify-between items-center'>
      <div className='flex flex-col'>
        <div className='flex items-center mb-1'>
          <span className='text-sm font-medium text-gray-700'>
            {formatNumbers(ticket.numbers)}
          </span>
        </div>
        <a
          href={`https://etherscan.io/address/${ticket.player}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-xs text-gray-500 hover:text-gray-700 flex items-center'
        >
          <span>
            {ticket.player.slice(0, 6)}...{ticket.player.slice(-4)}
          </span>
          <ExternalLink />
        </a>
      </div>
      <a
        href={`https://etherscan.io/tx/${ticket.transactionHash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 py-1 px-2 rounded-full transition-colors duration-150 flex items-center'
      >
        View Tx
        <ExternalLink />
      </a>
    </div>
  </div>
)

const TicketList: React.FC<{
  tickets: Ticket[]
  isLoading: boolean
}> = ({ tickets, isLoading }) => {
  if (isLoading) {
    return (
      <div className='flex-grow flex items-center justify-center'>
        <div className='flex flex-col items-center space-y-3'>
          <svg
            className='animate-spin h-5 w-5 text-gray-500'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <span className='text-sm text-gray-600'>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-grow overflow-y-auto'>
      <div className='px-4'>
        {tickets.length > 0 && (
          <>
            {tickets.map((ticket, i) => (
              <TicketItem key={i} ticket={ticket} />
            ))}
            <div className='text-sm text-center p-4 bg-gray-50 rounded-lg my-4 mx-2'>
              <p className='text-gray-600'>
                To get notifications for all ticket purchases, draws, and when numbers are
                revealed, join the Discord!
              </p>
              <a
                href='https://discord.gg/yourdiscord'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mt-2'
              >
                Discord
                <ExternalLink />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const RecentPurchases: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { tickets, isLoading, loadLatestTickets } = useTicketHistory()

  useEffect(() => {
    if (isOpen) {
      loadLatestTickets()
    }
  }, [isOpen, loadLatestTickets])

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <button
        onClick={toggleOpen}
        className={`bg-gray-900 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isOpen ? 'rotate-45' : ''
        } w-16 h-16 flex items-center justify-center`}
      >
        <Ticket className='w-8 h-8' />
      </button>
      {isOpen && (
        <div
          className='fixed right-4 bottom-24 bg-white z-40 shadow-xl rounded-lg overflow-hidden flex flex-col'
          style={{ width: '350px', height: '80vh' }}
        >
          <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50'>
            <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
              <span className='mr-2'>🎟️</span>
              Recent Purchases
            </h3>
            <button onClick={toggleOpen} className='text-gray-500 hover:text-gray-700'>
              <Close className='w-6 h-6' />
            </button>
          </div>

          <TicketList tickets={tickets} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default RecentPurchases
