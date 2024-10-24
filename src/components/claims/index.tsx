'use client'

import React, { FC, useEffect, useState } from 'react'
import { isAddress } from 'viem'

import { useClaimPrize, useLotteryInfo, useWinningInfo } from '@/hooks'

import ClaimError from './error'
import ClaimFeedback from './feedback'
import ClaimResults from './results'
import ClaimSearch from './search'

const ClaimPage: FC<{ address: string | null }> = ({ address }) => {
  const [walletAddress, setWalletAddress] = useState('')
  const [gameNumber, setGameNumber] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false)

  const handleWalletChange = (address: string) => {
    setWalletAddress(address)
    setIsSearching(false)
    setShouldFetch(false)
    setValidationError(null)
  }

  const handleGameNumberChange = (number: string) => {
    setGameNumber(number)
    setIsSearching(false)
    setShouldFetch(false)
    setValidationError(null)
  }

  const { lotteryInfo } = useLotteryInfo()

  useEffect(() => {
    if (address && isAddress(address)) {
      setWalletAddress(address)
    }
  }, [address])

  const { winningInfo, isError, isLoading } = useWinningInfo({
    gameNumber,
    walletAddress,
    shouldFetch,
  })

  const {
    handleClaim,
    status: claimStatus,
    isConfirming,
    isConfirmed,
    hash,
    error: claimError,
    reset: resetClaim,
  } = useClaimPrize()

  const validateSearch = () => {
    if (!walletAddress.trim()) {
      return 'Please enter a wallet address'
    }

    if (!isAddress(walletAddress)) {
      return 'Invalid wallet address format'
    }

    if (!gameNumber.trim()) {
      return 'Please enter a game number'
    }

    const parsedGameNumber = parseInt(gameNumber)
    if (isNaN(parsedGameNumber) || parsedGameNumber < 0) {
      return 'Game number must be a non-negative integer'
    }

    if (lotteryInfo && parsedGameNumber > lotteryInfo.gameNumber) {
      return `Game number cannot be greater than the current active game (${lotteryInfo.gameNumber})`
    }

    return null
  }

  const handleSearch = () => {
    const error = validateSearch()
    setValidationError(error)

    if (!error) {
      setIsSearching(true)
      setShouldFetch(true)
    }
  }

  const onClaim = async () => {
    await handleClaim(gameNumber)
    if (claimStatus === 'success' && isConfirmed) {
      setShouldFetch(true)
    }
  }

  useEffect(() => {
    if (!isSearching) {
      resetClaim()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching])

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-6'>
      <ClaimSearch
        walletAddress={walletAddress}
        setWalletAddress={handleWalletChange}
        gameNumber={gameNumber}
        setGameNumber={handleGameNumberChange}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />

      {validationError && <ClaimError message={validationError} />}

      {isSearching && (
        <>
          {isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
              <span className='ml-2 text-gray-600'>Loading...</span>
            </div>
          ) : isError ? (
            <div className='p-4 bg-red-50 text-red-600 rounded-lg border border-red-200'>
              Failed to fetch prize information. Make sure the game has already been completed.
            </div>
          ) : (
            winningInfo && (
              <>
                <ClaimResults winningInfo={winningInfo} handleClaim={onClaim} />
                <ClaimFeedback
                  status={claimStatus}
                  isConfirming={isConfirming}
                  isConfirmed={isConfirmed}
                  hash={hash}
                  error={claimError}
                  onReset={resetClaim}
                />
              </>
            )
          )}
        </>
      )}
    </div>
  )
}

export default ClaimPage
