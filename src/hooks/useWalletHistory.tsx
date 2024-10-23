import { useCallback, useState } from 'react'
import { Address, Log, PublicClient } from 'viem'
import { usePublicClient, useReadContract } from 'wagmi'

import { CONTRACT_ADDRESS } from '@/utils/constants'
import lotteryABI from '@/contracts/LotteryABI.json'
import { BasicTicket } from '@/utils/types'
import { MAX_TICKETS_TO_DISPLAY } from '@/utils/constants'

export interface WalletHistoryParams {
  walletAddress: Address
  gameNumber: number
}

export interface WalletHistory {
  tickets: BasicTicket[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

type TicketPurchasedEvent = {
  player: string
  gameNumber: bigint
  numbers: readonly bigint[]
  etherball: bigint
}

type TicketPurchasedLog = Log & {
  args: TicketPurchasedEvent
}

interface BlockTimestamps {
  [blockNumber: string]: number
}

interface GameBlocks {
  gameStartBlock: bigint | undefined
  nextGameStartBlock: bigint | undefined
}

const getTicketEvent = () => lotteryABI.find((event) => event.name === 'TicketPurchased')

const parseLogToTicket = (log: TicketPurchasedLog): BasicTicket => ({
  player: log.args.player,
  gameNumber: Number(log.args.gameNumber),
  numbers: [...log.args.numbers.map((n) => Number(n)), Number(log.args.etherball)],
  transactionHash: log.transactionHash ?? '0x0000000000000000000000000000000000000000',
})

const getBlockTimestamps = async (
  publicClient: PublicClient,
  blockNumbers: bigint[],
): Promise<BlockTimestamps> => {
  const blocks = await Promise.all(
    blockNumbers.map((bn) => publicClient.getBlock({ blockNumber: bn })),
  )
  return Object.fromEntries(blocks.map((b) => [b.number.toString(), Number(b.timestamp)]))
}

const useGameBlocks = (gameNumber: number): GameBlocks => {
  const { data: gameStartBlock } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lotteryABI,
    functionName: 'gameStartBlock',
    args: [BigInt(gameNumber)],
  }) as { data: bigint | undefined }

  const { data: nextGameStartBlock } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lotteryABI,
    functionName: 'gameStartBlock',
    args: [BigInt(gameNumber + 1)],
  }) as { data: bigint | undefined }

  return { gameStartBlock, nextGameStartBlock }
}

export default function useWalletHistory({
  walletAddress,
  gameNumber,
}: WalletHistoryParams): WalletHistory {
  const [tickets, setTickets] = useState<BasicTicket[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const publicClient = usePublicClient()
  const { gameStartBlock, nextGameStartBlock } = useGameBlocks(gameNumber)

  const fetchTickets = useCallback(
    async (fromBlock: bigint, toBlock: bigint): Promise<BasicTicket[]> => {
      if (!publicClient) return []

      const ticketEvent = getTicketEvent()
      if (!ticketEvent) {
        throw new Error('TicketPurchased event not found in ABI')
      }

      try {
        const logs = (await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: ticketEvent as any,
          fromBlock,
          toBlock,
        })) as TicketPurchasedLog[]

        return logs.map(parseLogToTicket)
      } catch (error) {
        console.error('Error fetching tickets:', error)
        throw error
      }
    },
    [publicClient],
  )

  const refetch = useCallback(async () => {
    if (!publicClient || gameStartBlock === undefined || nextGameStartBlock === undefined) {
      return
    }

    setIsLoading(true)
    setError(null)
    setTickets([])

    try {
      const currentBlock = await publicClient.getBlockNumber()
      const toBlock = nextGameStartBlock === 0n ? currentBlock : nextGameStartBlock - 1n

      const fetchedTickets = await fetchTickets(gameStartBlock, toBlock)
      const walletTickets = fetchedTickets.filter(
        (ticket) => ticket.player.toLowerCase() === walletAddress.toLowerCase(),
      )

      setTickets(walletTickets.slice(0, MAX_TICKETS_TO_DISPLAY))
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching tickets'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, gameStartBlock, nextGameStartBlock, walletAddress, fetchTickets])

  return { tickets, isLoading, error, refetch }
}
