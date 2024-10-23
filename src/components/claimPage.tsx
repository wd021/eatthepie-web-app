'use client'

import React, { FC, useEffect, useState } from 'react'
import { isAddress } from 'viem'

import { useClaimPrize, useLotteryInfo, useWinningInfo } from '@/hooks'

import SearchContainer from './searchContainer'

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className='flex items-center p-4 mb-6 text-red-800 border-l-4 border-red-600 bg-red-50'>
    <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
    <span>{message}</span>
  </div>
)

interface ClaimFeedbackProps {
  status: TransactionStatus
  isConfirming: boolean
  isConfirmed: boolean
  hash?: string
  error: Error | null
  onReset: () => void
}

const ClaimFeedback: React.FC<ClaimFeedbackProps> = ({
  status,
  isConfirming,
  isConfirmed,
  hash,
  error,
  onReset,
}) => {
  if (status === 'idle') return null

  const renderEtherscanLink = () =>
    hash && (
      <a
        href={`https://etherscan.io/tx/${hash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors mt-2'
      >
        <span>View on Etherscan</span>
        <svg className='w-4 h-4 ml-1' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
          <path
            d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path d='M15 3h6v6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M10 14L21 3' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </a>
    )

  return (
    <div className='mt-4 p-4 rounded-lg border bg-white'>
      <div className={`${status === 'success' && isConfirmed ? 'text-center' : ''}`}>
        {status === 'pending' && (
          <>
            <h3 className='flex items-center text-lg font-semibold'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3'></div>
              Waiting for Confirmation
            </h3>
            <p className='mt-2 text-gray-600'>Please confirm the transaction in your wallet</p>
          </>
        )}

        {status === 'success' && isConfirming && (
          <>
            <h3 className='flex items-center text-lg font-semibold'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3'></div>
              Transaction in Progress
            </h3>
            <div className='mt-2'>
              <p>Your transaction has been submitted</p>
              {renderEtherscanLink()}
            </div>
          </>
        )}

        {status === 'success' && isConfirmed && (
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-green-600'>
              Prize Successfully Claimed!
            </h3>
            <div>{renderEtherscanLink()}</div>
          </div>
        )}

        {(status === 'error' || (status === 'success' && !isConfirmed && !isConfirming)) && (
          <>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              {error?.message.includes('Transaction cancelled')
                ? 'Transaction Cancelled'
                : 'Failed to Claim Prize'}
            </h3>
            <p className='text-gray-600 mb-4'>
              Make sure you&apos;ve connected the right wallet and network
            </p>
            <button
              onClick={onReset}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                        transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

interface ResultsSectionProps {
  winningInfo: WinningInfo
  handleClaim: () => Promise<void>
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ winningInfo, handleClaim }) => {
  if (!winningInfo) return null

  const { goldWin, silverWin, bronzeWin, totalPrize, claimed } = winningInfo
  const hasWon = goldWin || silverWin || bronzeWin

  const PrizeRow = ({ type, won }: { type: 'gold' | 'silver' | 'bronze'; won: boolean }) => {
    const styles = {
      gold: {
        icon: '🏆',
        title: 'Gold',
        description: 'All numbers matched',
      },
      silver: {
        icon: '🥈',
        title: 'Silver',
        description: '3 in-a-row',
      },
      bronze: {
        icon: '🥉',
        title: 'Bronze',
        description: '2 in-a-row',
      },
    }

    return (
      <div
        className={`flex items-center p-4 border rounded-lg transition-all duration-200 ${
          won ? 'bg-green-50 border-green-200 shadow-sm' : 'border-gray-100'
        }`}
      >
        <div className='flex items-center flex-1'>
          <span className='text-2xl mr-3'>{styles[type].icon}</span>
          <div>
            <span className={`font-medium block ${won ? 'text-gray-900' : 'text-gray-400'}`}>
              {styles[type].title}
            </span>
            <span className={`text-sm ${won ? 'text-gray-600' : 'text-gray-400'}`}>
              {styles[type].description}
            </span>
          </div>
        </div>
        {won && (
          <div className='flex items-center text-green-600'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <div className='flex items-center space-x-2'>
          <svg
            className='w-6 h-6 text-green-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h2 className='text-xl font-semibold text-gray-900'>Results</h2>
        </div>
      </div>

      {hasWon ? (
        <div>
          <div className='p-6 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <div className='flex items-center space-x-2'>
                  <span className='text-2xl'>🎉</span>
                  <h3 className='text-lg font-medium text-gray-900'>Congratulations!</h3>
                </div>
                <div className='mt-1 flex items-baseline space-x-2'>
                  <span className='text-2xl font-bold text-green-600'>{totalPrize} ETH</span>
                  <span className='text-sm text-gray-500'>Prize Value</span>
                </div>
              </div>

              <div className='flex items-center'>
                {claimed ? (
                  <div className='px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium inline-flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Prize Claimed
                  </div>
                ) : (
                  <button
                    onClick={handleClaim}
                    className='inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg
                             hover:bg-green-700 transition-colors duration-150
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                  >
                    <span>Claim Prize</span>
                    <svg
                      className='ml-2 w-4 h-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7l5 5m0 0l-5 5m5-5H6'
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='mb-4'>
              <h4 className='text-sm font-medium text-gray-500'>Prize Breakdown</h4>
            </div>
            <div className='space-y-3'>
              <PrizeRow type='gold' won={goldWin} />
              <PrizeRow type='silver' won={silverWin} />
              <PrizeRow type='bronze' won={bronzeWin} />
            </div>
          </div>
        </div>
      ) : (
        <div className='px-6 py-12 text-center'>
          <div className='w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-6 h-6 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-1'>No Prizes Found</h3>
          <p className='text-gray-500'>
            We couldn&apos;t find any prizes for this wallet and game number
          </p>
        </div>
      )}
    </div>
  )
}

interface ClaimPageProps {
  address: string | null
}

interface FormErrors {
  walletAddress?: string
  gameNumber?: string
}

const ClaimPage: FC<ClaimPageProps> = ({ address }) => {
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

  const { lotteryInfo, isLoading: isLotteryInfoLoading } = useLotteryInfo()

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
  }, [isSearching])

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-6'>
      <SearchContainer
        walletAddress={walletAddress}
        setWalletAddress={handleWalletChange}
        gameNumber={gameNumber}
        setGameNumber={handleGameNumberChange}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />

      {validationError && <ErrorMessage message={validationError} />}

      {isSearching && (
        <>
          {isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
              <span className='ml-2 text-gray-600'>Loading...</span>
            </div>
          ) : isError ? (
            <div className='p-4 bg-red-50 text-red-600 rounded-lg border border-red-200'>
              Failed to fetch prize information. Make sure the game has already been completed.
            </div>
          ) : (
            winningInfo && (
              <>
                <ResultsSection winningInfo={winningInfo} handleClaim={onClaim} />
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
