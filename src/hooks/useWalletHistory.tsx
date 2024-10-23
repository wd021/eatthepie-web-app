import { useCallback, useState } from 'react'
import { Address, Log } from 'viem'
import { usePublicClient, useReadContract } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'
import { Ticket } from '@/utils/types'

const MAX_TICKETS = 500

export interface WalletHistoryParams {
  walletAddress: Address
  gameNumber: number
}

export interface WalletHistory {
  tickets: Ticket[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export default function useWalletHistory({
  walletAddress,
  gameNumber,
}: WalletHistoryParams): WalletHistory {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const publicClient = usePublicClient()

  const { data: gameStartBlock } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: 'gameStartBlock',
    args: [BigInt(gameNumber)],
  }) as { data: bigint | undefined }

  const { data: nextGameStartBlock } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: 'gameStartBlock',
    args: [BigInt(gameNumber + 1)],
  }) as { data: bigint | undefined }

  console.log('here we go', gameNumber, gameStartBlock, nextGameStartBlock)

  const fetchTickets = useCallback(
    async (fromBlock: bigint, toBlock: bigint) => {
      if (!publicClient) return []

      const ticketEvent = lotteryABI.find((event) => event.name === 'TicketPurchased')
      if (!ticketEvent) {
        console.error('TicketPurchased event not found in ABI')
        return []
      }

      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESSES.LOTTERY,
        event: ticketEvent as any,
        fromBlock,
        toBlock,
      })

      console.log('logs logs', logs)

      const ticketsWithoutTimestamp = logs.map((log: Log) => ({
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

  const refetch = useCallback(async () => {
    if (gameStartBlock === undefined || nextGameStartBlock === undefined || !publicClient)
      return

    setIsLoading(true)
    setError(null)

    try {
      const currentBlock = await publicClient.getBlockNumber()
      const toBlock = nextGameStartBlock === 0n ? currentBlock : nextGameStartBlock - 1n

      console.log('fetching tickets', gameStartBlock, toBlock)

      const fetchedTickets = await fetchTickets(gameStartBlock, toBlock)
      const walletTickets = fetchedTickets.filter(
        (ticket) => ticket.player.toLowerCase() === walletAddress.toLowerCase(),
      )

      const limitedTickets = walletTickets.slice(0, MAX_TICKETS)

      // Here you would determine the status and cost of each ticket
      // This is a placeholder and should be replaced with your actual logic
      // const processedTickets = walletTickets.map((ticket) => ({
      //   ...ticket,
      //   status: 'Pending', // Replace with actual status logic
      //   cost: '0.1 ETH', // Replace with actual cost calculation
      // }))

      setTickets(limitedTickets)
    } catch (err) {
      setError('An error occurred while fetching tickets')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, gameStartBlock, nextGameStartBlock, walletAddress, fetchTickets])

  return { tickets, isLoading, error, refetch }
}
