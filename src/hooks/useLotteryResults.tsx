import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'

import lotteryABI from '@/abi/LotteryABI.json'
import { CONTRACT_ADDRESS, RESULTS_PAGE_SIZE } from '@/utils/constants'
import { GameBasicInfo, UseLotteryResultsReturn } from '@/utils/types'

const calculateGameIds = (
  currentGameNumber: bigint | undefined,
  currentPage: number,
): { startGameId: bigint; endGameId: bigint } => {
  if (currentGameNumber === undefined) {
    return { startGameId: 1n, endGameId: 0n }
  }

  const endGameId = currentGameNumber - BigInt(currentPage * Number(RESULTS_PAGE_SIZE))
  const startGameId = endGameId > RESULTS_PAGE_SIZE ? endGameId - (RESULTS_PAGE_SIZE - 1n) : 1n

  return { startGameId, endGameId }
}

const mergeAndSortGames = (
  prevGames: GameBasicInfo[],
  newGames: GameBasicInfo[],
): GameBasicInfo[] => {
  const uniqueGames = newGames.filter(
    (newGame) => !prevGames.some((existingGame) => existingGame.gameId === newGame.gameId),
  )

  return [...prevGames, ...uniqueGames].sort((a, b) => (b.gameId > a.gameId ? 1 : -1))
}

const useGamePagination = (currentGameNumber: bigint | undefined, currentPage: number) => {
  const { startGameId, endGameId } = useMemo(
    () => calculateGameIds(currentGameNumber, currentPage),
    [currentGameNumber, currentPage],
  )

  const hasMore = useMemo(() => startGameId > 1n, [startGameId])

  return { startGameId, endGameId, hasMore }
}

const useCurrentGameNumber = () => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lotteryABI,
    functionName: 'currentGameNumber',
  })
}

export default function useLotteryResults(): UseLotteryResultsReturn {
  const [currentPage, setCurrentPage] = useState(0)
  const [allGames, setAllGames] = useState<GameBasicInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  const { data: currentGameNumber, isError: isCurrentGameNumberError } = useCurrentGameNumber()

  const { startGameId, endGameId, hasMore } = useGamePagination(
    currentGameNumber as bigint | undefined,
    currentPage,
  )

  const {
    data: gameInfos,
    isLoading,
    isError: isGameInfosError,
  } = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: lotteryABI,
        functionName: 'getBasicGameInfo',
        args: [startGameId, endGameId],
      },
    ],
  })

  useEffect(() => {
    if (isCurrentGameNumberError || isGameInfosError) {
      setError('Failed to fetch lottery data. Please try again.')
    } else {
      setError(null)
    }
  }, [isCurrentGameNumberError, isGameInfosError])

  useEffect(() => {
    if (!gameInfos?.[0].result || isLoading) return

    const newGames = gameInfos[0].result as GameBasicInfo[]
    if (newGames.length > 0) {
      setAllGames((prevGames) => mergeAndSortGames(prevGames, newGames))
    }
  }, [gameInfos, isLoading])

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
