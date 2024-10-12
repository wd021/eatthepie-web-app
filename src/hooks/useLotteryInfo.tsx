import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'
import { GameInfo, LotteryInfo } from '@/utils/types'

const formatLotteryInfo = (lotteryInfo: GameInfo, ticketPrice: bigint) => {
  const difficultyMap = ['Easy', 'Medium', 'Hard']

  return {
    gameNumber: Number(lotteryInfo[0]),
    difficulty: difficultyMap[lotteryInfo[1]] || 'Unknown',
    prizePool: formatEther(lotteryInfo[2]),
    drawTime: new Date(Number(lotteryInfo[3]) * 1000).toLocaleString(),
    timeUntilDraw: formatTimeUntilDraw(Number(lotteryInfo[4])),
    secondsUntilDraw: Number(lotteryInfo[4]),
    ticketPrice: formatEther(ticketPrice),
    ticketsSold: Number(lotteryInfo[2] / ticketPrice),
  }
}

const formatTimeUntilDraw = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`
}

export default function useLotteryInfo() {
  const {
    data: gameInfo,
    isError: isGameInfoError,
    isLoading: isGameInfoLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: 'getCurrentGameInfo',
  }) as { data: GameInfo | undefined; isError: boolean; isLoading: boolean }

  const {
    data: ticketPrice,
    isError: isTicketPriceError,
    isLoading: isTicketPriceLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY,
    abi: lotteryABI,
    functionName: 'ticketPrice',
  }) as { data: bigint; isError: boolean; isLoading: boolean }

  const isLoading = isGameInfoLoading || isTicketPriceLoading
  const isError = isGameInfoError || isTicketPriceError

  let lotteryInfo: LotteryInfo | undefined

  if (gameInfo && ticketPrice) {
    lotteryInfo = formatLotteryInfo(gameInfo, ticketPrice)
  }

  return {
    lotteryInfo,
    isLoading,
    isError,
  }
}
