'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useChainId, usePublicClient } from 'wagmi'

import LotteryABI from '@/contracts/LotteryABI.json'
import { Close, Ticket } from '@/icons'

interface Ticket {
  player: string
  gameNumber: number
  numbers: number[]
  blockNumber: bigint
  transactionHash: `0x${string}`
  timestamp: number
}

const BATCH_SIZE = 2000n
const MAX_TICKETS = 500
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS! as `0x${string}`

const ExternalLinkIcon: React.FC = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-4 w-4 ml-1'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
    />
  </svg>
)

const formatNumbers = (numbers: number[]): string => {
  return numbers.map((num) => num.toString().padStart(2, '0')).join(' - ')
}

const TicketItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
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
          <ExternalLinkIcon />
        </a>
      </div>
      <a
        href={`https://etherscan.io/tx/${ticket.transactionHash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 py-1 px-2 rounded-full transition-colors duration-150 flex items-center'
      >
        View Tx
        <ExternalLinkIcon />
      </a>
    </div>
  </div>
)

const TicketList: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => (
  <div className='flex-grow overflow-y-auto px-4'>
    {tickets.length === 0 ? (
      <p className='text-center text-gray-500'>No ticket purchases found.</p>
    ) : (
      tickets.map((ticket, index) => (
        <TicketItem key={ticket.transactionHash} ticket={ticket} />
      ))
    )}
  </div>
)

const LoadMoreButton: React.FC<{
  isLoading: boolean
  onClick: () => void
  disabled: boolean
}> = ({ isLoading, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    className='w-full py-2 px-4 bg-gray-800 text-white rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95'
  >
    {isLoading ? (
      <div className='flex items-center justify-center'>
        <svg className='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
        Loading...
      </div>
    ) : (
      'Load More'
    )}
  </button>
)

const useTicketFetcher = (publicClient: any) => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentBlock, setCurrentBlock] = useState<bigint | null>(null)
  const [oldestLoadedTimestamp, setOldestLoadedTimestamp] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchTickets = useCallback(
    async (fromBlock: bigint, toBlock: bigint) => {
      const ticketEvent = LotteryABI.find((event) => event.name === 'TicketPurchased')
      if (!ticketEvent || !publicClient) {
        console.error('TicketPurchased event not found in ABI or public client is undefined')
        return []
      }

      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: ticketEvent,
        fromBlock,
        toBlock,
      })

      const ticketsWithoutTimestamp = logs.map((log: any) => ({
        player: log.args.player,
        gameNumber: Number(log.args.gameNumber),
        numbers: [
          ...log.args.numbers.map((n: bigint) => Number(n)),
          Number(log.args.etherball),
        ],
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }))

      const blockNumbers = [...new Set(ticketsWithoutTimestamp.map((t) => t.blockNumber))]
      const blocks = await Promise.all(
        blockNumbers.map((bn) => publicClient.getBlock({ blockNumber: bn })),
      )
      const blockTimestamps = Object.fromEntries(
        blocks.map((b) => [b.number, Number(b.timestamp)]),
      )

      return ticketsWithoutTimestamp.map((ticket) => ({
        ...ticket,
        timestamp: blockTimestamps[ticket.blockNumber],
      }))
    },
    [publicClient],
  )

  const loadMoreTickets = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      const latestBlock = await publicClient?.getBlockNumber()
      if (!latestBlock) throw new Error('Unable to fetch latest block number')

      const fromBlock = currentBlock
        ? currentBlock - BATCH_SIZE > 1n
          ? currentBlock - BATCH_SIZE
          : 1n
        : latestBlock
      const toBlock = currentBlock || latestBlock

      const newTickets = await fetchTickets(fromBlock, toBlock)

      setTickets((prevTickets) => {
        const updatedTickets = [...prevTickets, ...newTickets].slice(0, MAX_TICKETS)
        setHasMore(updatedTickets.length < MAX_TICKETS)
        return updatedTickets
      })
      setCurrentBlock(fromBlock)

      const oldestTicket = newTickets[newTickets.length - 1]
      if (oldestTicket) {
        setOldestLoadedTimestamp(oldestTicket.timestamp)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentBlock, fetchTickets, publicClient, isLoading, hasMore])

  return { tickets, isLoading, oldestLoadedTimestamp, loadMoreTickets, hasMore }
}

const formatTimeElapsed = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}

const RecentPurchases: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const publicClient = usePublicClient()
  const chainId = useChainId()

  const { tickets, isLoading, oldestLoadedTimestamp, loadMoreTickets, hasMore } =
    useTicketFetcher(publicClient)

  useEffect(() => {
    if (isOpen && tickets.length === 0) {
      loadMoreTickets()
    }
  }, [isOpen, tickets.length, loadMoreTickets])

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
          <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-gray-800'>Recent Purchases</h3>
            <button onClick={toggleOpen} className='text-gray-500 hover:text-gray-700'>
              <Close className='w-6 h-6' />
            </button>
          </div>
          <TicketList tickets={tickets} />
          <div className='p-4 border-t border-gray-200'>
            <LoadMoreButton
              isLoading={isLoading}
              onClick={loadMoreTickets}
              disabled={!hasMore}
            />
            {oldestLoadedTimestamp && (
              <p className='text-xs text-gray-500 text-center mt-2'>
                Showing purchases from the last {formatTimeElapsed(oldestLoadedTimestamp)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentPurchases
