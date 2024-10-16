'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { useChainId, usePublicClient } from 'wagmi'

import LotteryABI from '@/contracts/LotteryABI.json'
import { Activity, Close } from '@/icons'

interface Ticket {
  player: string
  gameNumber: number
  numbers: number[]
  blockNumber: bigint
  transactionHash: `0x${string}`
  timestamp?: number
}

const BATCH_SIZE = 2000n
const BLOCKS_PER_DAY = 7200n // Approximate number of blocks per day on Ethereum

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ExternalLinkIcon = () => (
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

const TicketItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
  <div className='border-b border-gray-200 py-3'>
    <div className='flex justify-between items-center mb-1'>
      <span className='text-sm text-gray-600'>
        {ticket.timestamp ? formatTimestamp(ticket.timestamp) : `Block #${ticket.blockNumber}`}
      </span>
      <a
        href={`https://etherscan.io/address/${ticket.player}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-gray-600 hover:text-gray-800 flex items-center'
      >
        <span className='text-sm'>
          {ticket.player.slice(0, 6)}...{ticket.player.slice(-4)}
        </span>
        <ExternalLinkIcon />
      </a>
    </div>
    <div className='flex justify-between items-center'>
      <div>
        <span className='text-sm'>Numbers:</span>
        <span className='font-semibold ml-1.5'>{ticket.numbers.join(', ')}</span>
      </div>
      <a
        href={`https://etherscan.io/tx/${ticket.transactionHash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-xs text-gray-600 hover:text-gray-800 flex items-center'
      >
        View Tx
        <ExternalLinkIcon />
      </a>
    </div>
  </div>
)

const RecentPurchases: React.FC = () => {
  const contractAddress = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS! as `0x${string}`
  const [isOpen, setIsOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentBlock, setCurrentBlock] = useState<bigint | null>(null)
  const [oldestLoadedBlock, setOldestLoadedBlock] = useState<bigint | null>(null)
  const publicClient = usePublicClient()
  const chainId = useChainId()

  const fetchTickets = useCallback(
    async (fromBlock: bigint, toBlock: bigint) => {
      const ticketEvent = LotteryABI.find((event) => event.name === 'TicketPurchased')
      if (!ticketEvent || !publicClient) {
        console.error('TicketPurchased event not found in ABI or public client is undefined')
        return []
      }

      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: ticketEvent,
        fromBlock,
        toBlock,
      })

      const ticketsWithoutTimestamp = logs.map((log) => ({
        player: log.args.player,
        gameNumber: Number(log.args.gameNumber),
        numbers: [
          ...log.args.numbers.map((n: bigint) => Number(n)),
          Number(log.args.etherball),
        ],
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }))

      // Fetch timestamps for all blocks in one call
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
    [contractAddress, publicClient],
  )

  const loadMoreTickets = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const latestBlock = await publicClient?.getBlockNumber()
      if (!latestBlock) throw new Error('Unable to fetch latest block number')

      const fromBlock = currentBlock ? currentBlock - BATCH_SIZE : latestBlock
      const toBlock = currentBlock || latestBlock

      const newTickets = await fetchTickets(fromBlock, toBlock)

      setTickets((prevTickets) => [...prevTickets, ...newTickets])
      setCurrentBlock(fromBlock)
      setOldestLoadedBlock(fromBlock)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentBlock, fetchTickets, publicClient, isLoading])

  useEffect(() => {
    if (isOpen && tickets.length === 0) {
      loadMoreTickets()
    }
  }, [isOpen, tickets.length, loadMoreTickets])

  const estimatedDate = oldestLoadedBlock
    ? new Date(Date.now() - Number(oldestLoadedBlock / BLOCKS_PER_DAY) * 24 * 60 * 60 * 1000)
    : null

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-gray-800 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center'
      >
        {isOpen ? <Close className='w-6 h-6' /> : <Activity className='w-8 h-8' />}
      </button>
      {isOpen && (
        <div
          className='fixed right-4 bottom-24 bg-white z-40 shadow-xl rounded-lg overflow-hidden flex flex-col'
          style={{ width: '350px', height: 'calc(100vh - 120px)' }}
        >
          <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-gray-800'>Recent Purchases</h3>
            <button
              onClick={() => setIsOpen(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              <Close className='w-6 h-6' />
            </button>
          </div>
          <div className='flex-grow overflow-y-auto p-4'>
            {tickets.length === 0 ? (
              <p className='text-center text-gray-500'>No ticket purchases found.</p>
            ) : (
              tickets.map((ticket, index) => <TicketItem key={index} ticket={ticket} />)
            )}
          </div>
          <div className='p-4 border-t border-gray-200'>
            <button
              onClick={loadMoreTickets}
              disabled={isLoading}
              className='w-full py-2 px-4 bg-gray-800 text-white rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
            {oldestLoadedBlock && (
              <p className='text-xs text-gray-500 text-center mt-2'>
                Loaded up to block #{oldestLoadedBlock.toString()}
                {estimatedDate && ` (around ${estimatedDate.toLocaleDateString()})`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentPurchases
