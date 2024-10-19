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
  const [allGames, setAllGames] = useState<GameBasicInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  const { data: currentGameNumber, isError: isCurrentGameNumberError } = useReadContract({
    address: CONTRACT_ADDRESSES.LOTTERY as Address,
    abi: lotteryABI,
    functionName: 'currentGameNumber',
  })

  const endGameId = useMemo(() => {
    if (currentGameNumber === undefined) return 0n
    return BigInt(currentGameNumber as bigint) - BigInt(currentPage * PAGE_SIZE)
  }, [currentGameNumber, currentPage])

  const startGameId = useMemo(() => {
    return endGameId > BigInt(PAGE_SIZE) ? endGameId - BigInt(PAGE_SIZE - 1) : 1n
  }, [endGameId])

  const {
    data: gameInfos,
    isLoading,
    isError: isGameInfosError,
  } = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.LOTTERY as Address,
        abi: lotteryABI,
        functionName: 'getBasicGameInfo',
        args: [startGameId, endGameId],
      },
    ],
  })

  const newGames = useMemo(() => {
    if (gameInfos && gameInfos[0].result) {
      return gameInfos[0].result as GameBasicInfo[]
    }
    return []
  }, [gameInfos])

  useEffect(() => {
    if (isCurrentGameNumberError || isGameInfosError) {
      setError('Failed to fetch lottery data. Please try again.')
    } else {
      setError(null)
    }
  }, [isCurrentGameNumberError, isGameInfosError])

  useEffect(() => {
    if (newGames.length > 0) {
      setAllGames((prevGames) => {
        const uniqueGames = newGames.filter(
          (newGame) =>
            !prevGames.some((existingGame) => existingGame.gameId === newGame.gameId),
        )
        const updatedGames = [...prevGames, ...uniqueGames]
        return updatedGames.sort((a, b) => (b.gameId > a.gameId ? 1 : -1))
      })
      setHasMore(startGameId > 1n)
    } else if (!isLoading) {
      setHasMore(false)
    }
  }, [newGames, startGameId, isLoading])

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  return {
    games: allGames,
    hasMore,
    isLoading,
    loadMore,
    error,
  }
}
