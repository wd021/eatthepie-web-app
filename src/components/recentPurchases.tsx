'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { useTicketHistory } from '@/hooks'
import { Close, ExternalLink, Ticket } from '@/icons'
import { BLOCK_EXPLORER_LINKS, DISCORD_URL } from '@/utils/constants'
import { formatNumbers, trimAddress } from '@/utils/helpers'
import { Ticket as TicketType } from '@/utils/types'

const MODAL_DIMENSIONS = { width: '350px', height: '80vh' }

const BlockExplorerLink: React.FC<{
  href: string
  children: React.ReactNode
  className?: string
}> = ({ href, children, className }) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className={className}>
    {children}
    <ExternalLink />
  </a>
)

const LoadingSpinner: React.FC = () => (
  <div className='flex-grow flex items-center justify-center'>
    <div className='flex items-center'>
      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
      <span className='ml-2 text-sm text-gray-600'>Loading...</span>
    </div>
  </div>
)

const DiscordPrompt: React.FC = () => (
  <div className='text-sm text-center p-4 bg-gray-50 rounded-lg my-4 mx-2'>
    <p className='text-gray-600'>
      To get notifications for all ticket purchases, draws, and when numbers are revealed, join
      the Discord!
    </p>
    <BlockExplorerLink
      href={DISCORD_URL}
      className='text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mt-2'
    >
      Discord
    </BlockExplorerLink>
  </div>
)

const TicketItem: React.FC<{ ticket: TicketType }> = ({ ticket }) => {
  const networkName = process.env
    .NEXT_PUBLIC_LOTTERY_NETWORK as keyof typeof BLOCK_EXPLORER_LINKS
  const blockExplorer = BLOCK_EXPLORER_LINKS[networkName]

  return (
    <div className='border-b border-gray-200 last:border-b-0 p-3'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <div className='flex items-center mb-1'>{formatNumbers(ticket.numbers)}</div>
          <BlockExplorerLink
            href={`${blockExplorer}/address/${ticket.player}`}
            className='text-xs text-gray-500 hover:text-gray-700 flex items-center'
          >
            {trimAddress(ticket.player, 6, 4)}
          </BlockExplorerLink>
        </div>
        <BlockExplorerLink
          href={`${blockExplorer}/tx/${ticket.transactionHash}`}
          className='text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 py-1 px-2 rounded-full transition-colors duration-150 flex items-center'
        >
          View Tx
        </BlockExplorerLink>
      </div>
    </div>
  )
}

const BlockRangeInfo: React.FC = () => (
  <div className='px-4 py-2 bg-gray-50 border-b border-gray-100'>
    <p className='text-sm text-center text-gray-700'>
      Showing purchases from the last 800 blocks
      <span className='text-gray-500 text-xs ml-1'>(~2.5 hours)</span>
    </p>
  </div>
)

const TicketList: React.FC<{ tickets: TicketType[]; isLoading: boolean }> = ({
  tickets,
  isLoading,
}) => {
  if (isLoading) return <LoadingSpinner />

  return (
    <div className='flex-grow overflow-y-auto'>
      {tickets.length > 0 && (
        <>
          {tickets.map((ticket, i) => (
            <TicketItem key={`${ticket.transactionHash}-${i}`} ticket={ticket} />
          ))}
        </>
      )}
      <DiscordPrompt />
    </div>
  )
}

const ModalHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50'>
    <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
      <span className='mr-2'>🎟️</span>
      Recent Purchases
    </h3>
    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
      <Close className='w-6 h-6' />
    </button>
  </div>
)

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
          style={MODAL_DIMENSIONS}
        >
          <ModalHeader onClose={toggleOpen} />
          <BlockRangeInfo />
          <TicketList tickets={tickets} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default RecentPurchases
