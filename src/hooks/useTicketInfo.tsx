import { useAccount, useReadContract } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'

export default function useTicketInfo(gameNumber: number) {
  const { address } = useAccount()

  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: 'playerTicketCount',
    args: [address, BigInt(gameNumber)],
  })

  return {
    ticketCount: data ? Number(data) : 0,
    isLoading,
    isError,
  }
}
