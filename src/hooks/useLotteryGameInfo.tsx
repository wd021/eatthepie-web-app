import { Address } from 'viem'
import { useReadContract } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'
import { GameDetailedInfo } from '@/utils/types'

export default function useLotteryGameInfo(gameId: bigint) {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as Address,
    abi: lotteryABI,
    functionName: 'getDetailedGameInfo',
    args: [gameId],
  })

  return {
    gameInfo: data as GameDetailedInfo | undefined,
    isError,
    isLoading,
  }
}
