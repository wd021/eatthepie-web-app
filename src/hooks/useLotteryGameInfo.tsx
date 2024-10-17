import { Address, parseAbi } from 'viem'
import { useReadContract } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'

interface GameDetailedInfo {
  gameId: bigint
  status: number
  prizePool: bigint
  numberOfWinners: bigint
  winningNumbers: bigint[]
  difficulty: number
  drawInitiatedBlock: bigint
  randaoBlock: bigint
  randaoValue: bigint
  payouts: {
    gold: bigint
    silver: bigint
    bronze: bigint
  }
}

export default function useLotteryGameInfo(gameId: bigint) {
  const { data, isError, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as Address,
    abi: lotteryABI,
    functionName: 'getDetailedGameInfo',
    args: [gameId],
  })

  console.log(data)
  console.log(isError, error)
  console.log(isLoading)

  return {
    gameInfo: data as GameDetailedInfo | undefined,
    isError,
    isLoading,
  }
}
