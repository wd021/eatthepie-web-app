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
        className={`bg-gray-900 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isOpen ? 'rotate-45' : ''
        } w-16 h-16 flex items-center justify-center`}
      >
        <Ticket className='w-8 h-8' />
      </button>
      <div
        className={`fixed right-2 bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'bottom-[90px] h-[calc(100vh-105px)] opacity-100'
            : 'bottom-[90px] h-0 opacity-0'
        }`}
        style={{ width: '350px' }}
      >
        <div className='p-4 h-full flex flex-col'>
          <h3 className='text-lg font-semibold mb-2'>Latest Purchases</h3>
          <ul className='space-y-2 overflow-y-auto flex-grow hide-scrollbar'>
            {tickets.length === 0 ? (
              <p className='px-4 py-5 sm:p-6 text-gray-500'>No ticket purchases found.</p>
            ) : (
              <ul className='divide-y divide-gray-200'>
                {tickets.map((ticket, index) => (
                  <li key={index} className='px-4 py-5 sm:p-6'>
                    <p className='text-sm font-medium text-gray-900'>
                      Wallet:{' '}
                      <a
                        href={getEtherscanLink(ticket.player)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline'
                      >
                        {ticket.player.slice(0, 6)}...{ticket.player.slice(-4)}
                      </a>
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                      Game Number: {ticket.gameNumber}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                      Numbers: {ticket.numbers.join(', ')}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>Etherball: {ticket.etherball}</p>
                    <p className='mt-1 text-sm text-gray-500'>
                      Block: {ticket.blockNumber.toString()}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                      Transaction:{' '}
                      <a
                        href={`${getEtherscanLink(ticket.player)}/tx/${ticket.transactionHash}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline'
                      >
                        View on Etherscan
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </ul>
          <div className='px-4 py-4 sm:px-6'>
            <button
              onClick={loadMoreTickets}
              disabled={isLoading}
              className='w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
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
