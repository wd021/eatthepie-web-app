import { useMemo } from 'react'
import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import lotteryABI from '@/abi/LotteryABI.json'
import {
  CONTRACT_ADDRESS,
  Difficulty,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
} from '@/utils/constants'
import {
  GameInfo,
  LotteryInfo,
  TimeParts,
  UseContractResult,
  UseLotteryInfoResult,
} from '@/utils/types'

const calculateTimeParts = (totalSeconds: number): TimeParts => {
  const days = Math.floor(totalSeconds / SECONDS_PER_DAY)
  const hours = Math.floor((totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR)
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const seconds = totalSeconds % SECONDS_PER_MINUTE

  return { days, hours, minutes, seconds }
}

const formatTimeUntilDraw = (seconds: number): string => {
  const { days, hours, minutes, seconds: remainingSeconds } = calculateTimeParts(seconds)
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`
}

const getDifficultyLabel = (difficultyLevel: number): string => {
  return Difficulty[difficultyLevel] || 'Unknown'
}

const calculateTicketsSold = (prizePool: bigint, ticketPrice: bigint): string => {
  return (prizePool / ticketPrice).toString()
}

const formatDrawTime = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleString()
}

const formatLotteryInfo = (gameInfo: GameInfo, ticketPrice: bigint): LotteryInfo => {
  const [gameNumber, difficulty, prizePool, drawTimestamp, timeUntilDraw] = gameInfo

  return {
    gameNumber: Number(gameNumber),
    difficulty: getDifficultyLabel(difficulty),
    prizePool: formatEther(prizePool),
    drawTime: formatDrawTime(drawTimestamp),
    timeUntilDraw: formatTimeUntilDraw(Number(timeUntilDraw)),
    secondsUntilDraw: Number(timeUntilDraw),
    ticketPrice: formatEther(ticketPrice),
    ticketsSold: calculateTicketsSold(prizePool, ticketPrice),
  }
}

const useGameInfo = (): UseContractResult<GameInfo> => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lotteryABI,
    functionName: 'getCurrentGameInfo',
  }) as UseContractResult<GameInfo>
}

const useTicketPrice = (): UseContractResult<bigint> => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lotteryABI,
    functionName: 'ticketPrice',
  }) as UseContractResult<bigint>
}

export default function useLotteryInfo(): UseLotteryInfoResult {
  const {
    data: gameInfo,
    isError: isGameInfoError,
    isLoading: isGameInfoLoading,
  } = useGameInfo()

  const {
    data: ticketPrice,
    isError: isTicketPriceError,
    isLoading: isTicketPriceLoading,
  } = useTicketPrice()

  const isLoading = isGameInfoLoading || isTicketPriceLoading
  const isError = isGameInfoError || isTicketPriceError

  const lotteryInfo = useMemo(() => {
    if (!gameInfo || !ticketPrice) return undefined
    return formatLotteryInfo(gameInfo, ticketPrice)
  }, [gameInfo, ticketPrice])

  return {
    lotteryInfo,
    isLoading,
    isError,
  }
}
