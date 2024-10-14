'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { useChainId, usePublicClient } from 'wagmi'

import LotteryABI from '@/contracts/LotteryABI.json'
import { Ticket } from '@/icons'

interface TicketPurchasedEvent {
  player: `0x${string}`
  gameNumber: bigint
  numbers: [bigint, bigint, bigint]
  etherball: bigint
}

interface Ticket {
  player: string
  gameNumber: number
  numbers: number[]
  etherball: number
  blockNumber: bigint
  transactionHash: `0x${string}`
}

interface RecentTicketPurchasesProps {
  contractAddress: `0x${string}`
  abi: any[] // You might want to define a more specific type for your ABI
}

const BATCH_SIZE = 2000n // Fetch 2000 blocks at a time

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const TicketIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
)

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

const TicketItem = ({ ticket }) => (
  <div className='bg-white rounded-lg shadow-md p-4 mb-3 transition-shadow duration-300 hover:shadow-lg'>
    <div className='flex justify-between items-center mb-2'>
      <span className='text-sm font-medium text-gray-600'>
        {formatTimestamp(ticket.timestamp)}
      </span>
      <a
        href={`https://etherscan.io/address/${ticket.player}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-500 hover:text-blue-700 flex items-center'
      >
        <span className='text-sm'>
          {ticket.player.slice(0, 6)}...{ticket.player.slice(-4)}
        </span>
        <ExternalLinkIcon />
      </a>
    </div>
    <div className='flex justify-center bg-gray-100 rounded p-2 my-3'>
      {ticket.numbers.map((num, index) => (
        <span
          key={index}
          className='w-8 h-8 flex items-center justify-center font-bold text-gray-800 text-base'
        >
          {num}
        </span>
      ))}
    </div>
    <div className='text-center'>
      <a
        href={`https://etherscan.io/tx/${ticket.transactionHash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-sm text-blue-500 hover:text-blue-700 flex items-center justify-center'
      >
        View on Etherscan
        <ExternalLinkIcon />
      </a>
    </div>
  </div>
)

const RecentTicketPurchases: React.FC<{}> = (
  {
    // contractAddress,
    // abi,
  },
) => {
  const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

  const [isOpen, setIsOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentBlock, setCurrentBlock] = useState<bigint | null>(null)
  const publicClient = usePublicClient()
  const chainId = useChainId()

  const getEtherscanLink = useCallback(
    (address: string) => {
      const chainMap: { [key: number]: string } = {
        1: 'https://etherscan.io',
        5: 'https://goerli.etherscan.io',
        11155111: 'https://sepolia.etherscan.io',
        // Add more chains as needed
      }
      const baseUrl = chainMap[chainId] || 'https://etherscan.io'
      return `${baseUrl}/address/${address}`
    },
    [chainId],
  )

  const fetchTickets = useCallback(
    async (fromBlock: bigint, toBlock: bigint) => {
      const ticketEvent = LotteryABI.find((event) => event.name === 'TicketPurchased')
      if (!ticketEvent) {
        console.error('TicketPurchased event not found in ABI')
        return []
      }

      if (!publicClient) {
        console.error('Public client is undefined')
        return []
      }

      const logs = await publicClient.getLogs({
        address: contractAddress,
        event: ticketEvent,
        fromBlock,
        toBlock,
      })

      return logs.map((log) => ({
        player: log.args.player,
        gameNumber: Number(log.args.gameNumber),
        numbers: log.args.numbers.map((n: bigint) => Number(n)),
        etherball: Number(log.args.etherball),
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }))
    },
    [contractAddress, LotteryABI, publicClient],
  )

  const loadMoreTickets = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const fromBlock = currentBlock
        ? currentBlock - BATCH_SIZE
        : await (publicClient?.getBlockNumber() ??
            Promise.reject(new Error('Public client is undefined')))
      const toBlock = currentBlock || fromBlock

      const newTickets = await fetchTickets(fromBlock, toBlock)

      setTickets((prevTickets) => [...prevTickets, ...newTickets])
      setCurrentBlock(fromBlock)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentBlock, fetchTickets, publicClient, isLoading])

  useEffect(() => {
    loadMoreTickets()
  }, [])

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-gray-800 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center'
      >
        {isOpen ? <CloseIcon /> : <TicketIcon />}
      </button>
      <div
        className={`fixed right-4 bg-gray-50 rounded-lg shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'bottom-24 opacity-100 pointer-events-auto'
            : 'bottom-24 opacity-0 pointer-events-none'
        }`}
        style={{ width: '350px', maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className='p-4 h-full flex flex-col'>
          <h3 className='text-lg font-semibold mb-4 text-center text-gray-800'>
            Latest Purchases
          </h3>
          <div className='overflow-y-auto flex-grow'>
            {tickets.length === 0 ? (
              <p className='text-center text-gray-500'>No ticket purchases found.</p>
            ) : (
              tickets.map((ticket, index) => <TicketItem key={index} ticket={ticket} />)
            )}
          </div>
          <div className='mt-4'>
            <button
              onClick={loadMoreTickets}
              disabled={isLoading}
              className='w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentTicketPurchases
