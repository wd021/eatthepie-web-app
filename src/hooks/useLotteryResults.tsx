import { useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { CONTRACT_ADDRESSES } from '@/config/chainConfig'
import lotteryABI from '@/contracts/LotteryABI.json'

const PAGE_SIZE = 10

interface GameBasicInfo {
  gameId: bigint
  status: number
  prizePool: bigint
  numberOfWinners: bigint
  winningNumbers: bigint[]
}

export default function useLotteryResults() {
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { data: currentGameNumber } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as Address,
    abi: lotteryABI,
    functionName: 'currentGameNumber',
  })

  console.log('currentGameNumber', currentGameNumber)

  const endGameId =
    currentGameNumber !== undefined
      ? BigInt(currentGameNumber as number) - BigInt(currentPage * PAGE_SIZE)
      : 0n
  const startGameId = endGameId > BigInt(PAGE_SIZE) ? endGameId - BigInt(PAGE_SIZE - 1) : 1n

  const { data: gameInfos, isLoading } = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.LOTTERY as Address,
        abi: lotteryABI,
        functionName: 'getBasicGameInfo',
        args: [startGameId, endGameId],
      },
    ],
  })

  console.log('gameInfos', gameInfos)

  const games = useMemo(() => {
    if (gameInfos && gameInfos[0].result) {
      return gameInfos[0].result as GameBasicInfo[]
    }
    return []
  }, [gameInfos])

  useEffect(() => {
    if (games.length > 0) {
      setHasMore(startGameId > 1n)
    } else {
      setHasMore(false)
    }
  }, [games, startGameId])

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  return {
    games,
    hasMore,
    isLoading,
    loadMore,
  }
}
