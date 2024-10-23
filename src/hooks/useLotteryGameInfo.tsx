import { useReadContract } from 'wagmi'

import { CONTRACT_ADDRESS } from '@/utils/constants'
import lotteryABI from '@/contracts/LotteryABI.json'
import { GameDetailedInfo } from '@/utils/types'

export default function useLotteryGameInfo(gameId: bigint) {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
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
