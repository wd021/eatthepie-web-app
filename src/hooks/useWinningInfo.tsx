import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import lotteryABI from '@/abi/LotteryABI.json'
import { CONTRACT_ADDRESS } from '@/utils/constants'
import {
  ContractWinningsResult,
  UseWinningInfoParams,
  UseWinningInfoResult,
  WinningInfo,
} from '@/utils/types'

const parseWinningInfo = (data: ContractWinningsResult): WinningInfo => ({
  goldWin: data[0],
  silverWin: data[1],
  bronzeWin: data[2],
  totalPrize: formatEther(data[3]),
  claimed: data[4],
})

const shouldEnableQuery = (params: UseWinningInfoParams): boolean => {
  const { shouldFetch, gameNumber, walletAddress } = params
  return shouldFetch && Boolean(gameNumber && walletAddress)
}

const getQueryArgs = (params: UseWinningInfoParams) => {
  const { shouldFetch, gameNumber, walletAddress } = params
  return shouldFetch && gameNumber && walletAddress
    ? ([BigInt(gameNumber), walletAddress] as const)
    : undefined
}

export default function useWinningInfo({
  gameNumber,
  walletAddress,
  shouldFetch,
}: UseWinningInfoParams): UseWinningInfoResult {
  const {
    data,
    isError,
    isLoading: isContractLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lotteryABI,
    functionName: 'getUserGameWinnings',
    args: getQueryArgs({ gameNumber, walletAddress, shouldFetch }),
    query: {
      enabled: shouldEnableQuery({ gameNumber, walletAddress, shouldFetch }),
    },
  })

  const isLoading = Boolean(shouldFetch && isContractLoading)
  const winningInfo = data ? parseWinningInfo(data as ContractWinningsResult) : undefined

  return { winningInfo, isError, isLoading }
}
