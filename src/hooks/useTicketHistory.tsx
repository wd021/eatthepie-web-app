import { useCallback, useState } from 'react'
import { AbiEvent } from 'viem'
import { usePublicClient } from 'wagmi'

import lotteryABI from '@/abi/LotteryABI.json'
import {
  BATCH_SIZE_FOR_FETCHING,
  CONTRACT_ADDRESS,
  MAX_TICKETS_TO_DISPLAY,
} from '@/utils/constants'
import { Ticket, TicketPurchasedLog } from '@/utils/types'

const getTicketEvent = () => lotteryABI.find((event) => event.name === 'TicketPurchased')

const parseLogToTicket = (log: TicketPurchasedLog): Ticket => ({
  player: log.args.player,
  gameNumber: Number(log.args.gameNumber),
  numbers: [...log.args.numbers.map((n) => Number(n)), Number(log.args.etherball)],
  blockNumber: log.blockNumber,
  transactionHash: log.transactionHash,
})

export default function useTicketHistory() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  const fetchTickets = useCallback(
    async (fromBlock: bigint, toBlock: bigint): Promise<Ticket[]> => {
      const ticketEvent = getTicketEvent()

      if (!ticketEvent || !publicClient) {
        console.error('TicketPurchased event not found in ABI or public client is undefined')
        return []
      }

      try {
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: ticketEvent as AbiEvent,
          fromBlock,
          toBlock,
        })

        const limitedLogs = logs.slice(
          0,
          MAX_TICKETS_TO_DISPLAY,
        ) as unknown as TicketPurchasedLog[]
        return limitedLogs.map(parseLogToTicket)
      } catch (error) {
        console.error('Error in fetchTickets:', error)
        return []
      }
    },
    [publicClient],
  )

  const loadLatestTickets = useCallback(async () => {
    if (!publicClient) return

    setIsLoading(true)
    try {
      const latestBlock = await publicClient.getBlockNumber()
      const fromBlock =
        latestBlock - BATCH_SIZE_FOR_FETCHING > 1n ? latestBlock - BATCH_SIZE_FOR_FETCHING : 1n
      const newTickets = await fetchTickets(fromBlock, latestBlock)
      setTickets(newTickets)
    } catch (error) {
      console.error('Error loading latest tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchTickets, publicClient])

  return { tickets, isLoading, loadLatestTickets }
}
