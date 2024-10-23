import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'

export interface WinningInfo {
  goldWin: boolean
  silverWin: boolean
  bronzeWin: boolean
  totalPrize: string
  claimed: boolean
}

export default function useWinningInfo(
  gameNumber: string,
  walletAddress: string,
  shouldFetch: boolean,
) {
  const {
    data,
    isError,
    isLoading: isContractLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: 'getUserGameWinnings',
    args:
      shouldFetch && gameNumber && walletAddress
        ? [BigInt(gameNumber), walletAddress]
        : undefined,
    query: {
      enabled: shouldFetch && Boolean(gameNumber && walletAddress),
    },
  })

  const isLoading = Boolean(shouldFetch && isContractLoading)

  const winningInfo = data
    ? {
        goldWin: data[0],
        silverWin: data[1],
        bronzeWin: data[2],
        totalPrize: formatEther(data[3]),
        claimed: data[4],
      }
    : undefined

  return { winningInfo, isError, isLoading }
}
