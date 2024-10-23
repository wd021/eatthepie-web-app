'use client'

import React, { FC, useEffect, useState } from 'react'

import { useClaimPrize } from '@/hooks'
import { useWinningInfo } from '@/hooks'

const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

const isValidGameNumber = (number: string): boolean => {
  return /^\d+$/.test(number)
}

// components/ClaimFeedback.tsx
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

  return (
    <div className='mt-4 p-4 rounded-lg border'>
      {status === 'pending' && (
        <div className='flex items-center space-x-3'>
          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500'></div>
          <p>Please confirm the transaction in your wallet</p>
        </div>
      )}

      {status === 'success' && isConfirming && (
        <div className='flex items-center space-x-3'>
          <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500'></div>
          <div>
            <p>Transaction Sent</p>
            <p className='text-sm text-gray-500'>Waiting for confirmation...</p>
            {hash && (
              <a
                href={`https://etherscan.io/tx/${hash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline text-sm'
              >
                View on Etherscan
              </a>
            )}
          </div>
        </div>
      )}

      {status === 'success' && isConfirmed && (
        <div className='text-center'>
          <div className='text-4xl mb-2'>🎉</div>
          <h3 className='text-xl font-bold text-green-600 mb-2'>Prize Claimed!</h3>
          {hash && (
            <a
              href={`https://etherscan.io/tx/${hash}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline text-sm'
            >
              View on Etherscan
            </a>
          )}
        </div>
      )}

      {(status === 'error' || (status === 'success' && !isConfirmed && !isConfirming)) && (
        <div className='text-center'>
          <div className='text-4xl mb-2'>😕</div>
          <h3 className='text-xl font-bold text-red-600 mb-2'>
            {error?.message.includes('Transaction cancelled')
              ? 'Transaction Cancelled'
              : 'Failed to Claim Prize'}
          </h3>
          <p className='text-gray-600 mb-4'>{error?.message}</p>
          <button
            onClick={onReset}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

// components/LoadingSpinner.tsx
const LoadingSpinner = () => (
  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
)

// components/SearchSection.tsx
interface SearchSectionProps {
  walletAddress: string
  setWalletAddress: (address: string) => void
  gameNumber: string
  setGameNumber: (number: string) => void
  handleSearch: () => void
  isLoading: boolean
  errors: {
    walletAddress?: string
    gameNumber?: string
  }
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  walletAddress,
  setWalletAddress,
  gameNumber,
  setGameNumber,
  handleSearch,
  isLoading,
  errors,
}) => (
  <div className='bg-white shadow-md rounded-lg overflow-hidden mb-8'>
    <div className='px-6 py-4 bg-gray-50 flex items-center'>
      <h2 className='text-2xl font-bold text-gray-800'>Check Prize Status</h2>
    </div>
    <div className='p-6 grid grid-cols-1 md:grid-cols-12 gap-4'>
      <div className='col-span-8'>
        <input
          type='text'
          placeholder='Enter wallet address'
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.walletAddress ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.walletAddress && (
          <p className='mt-1 text-sm text-red-500'>{errors.walletAddress}</p>
        )}
      </div>
      <div className='col-span-2'>
        <input
          type='text'
          placeholder='Game number'
          value={gameNumber}
          onChange={(e) => setGameNumber(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.gameNumber ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.gameNumber && <p className='mt-1 text-sm text-red-500'>{errors.gameNumber}</p>}
      </div>
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className='col-span-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      >
        {isLoading ? (
          <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
        ) : (
          'Search'
        )}
      </button>
    </div>
  </div>
)

// components/ResultsSection.tsx
interface ResultsSectionProps {
  winningInfo: WinningInfo
  handleClaim: () => Promise<void>
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ winningInfo, handleClaim }) => {
  if (!winningInfo) return null

  const { goldWin, silverWin, bronzeWin, totalPrize, claimed } = winningInfo
  const hasWon = goldWin || silverWin || bronzeWin

  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden'>
      <div className='px-6 py-4 bg-gray-50'>
        <h2 className='text-2xl font-bold text-gray-800'>Results</h2>
      </div>

      <div className='p-6'>
        {hasWon ? (
          <div className='space-y-4'>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-green-800'>
                Congratulations! You've won {totalPrize} ETH
              </h3>
              <div className='mt-2 space-y-2'>
                {goldWin && (
                  <div className='flex items-center'>
                    <span className='text-yellow-500 mr-2'>🏆</span>
                    <span>Gold Prize Winner!</span>
                  </div>
                )}
                {silverWin && (
                  <div className='flex items-center'>
                    <span className='text-gray-400 mr-2'>🥈</span>
                    <span>Silver Prize Winner!</span>
                  </div>
                )}
                {bronzeWin && (
                  <div className='flex items-center'>
                    <span className='text-amber-700 mr-2'>🥉</span>
                    <span>Bronze Prize Winner!</span>
                  </div>
                )}
              </div>
            </div>

            {claimed ? (
              <div className='flex items-center text-green-600'>
                <svg
                  className='w-5 h-5 mr-2'
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
                Prize has been claimed
              </div>
            ) : (
              <button
                onClick={handleClaim}
                className='w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                Claim Prize
              </button>
            )}
          </div>
        ) : (
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center'>
            <svg
              className='w-5 h-5 text-gray-500 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            <span>No prizes found for this wallet and game number</span>
          </div>
        )}
      </div>
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [shouldFetch, setShouldFetch] = useState(false)

  const handleWalletChange = (address: string) => {
    setWalletAddress(address)
    setErrors((prev) => ({ ...prev, walletAddress: undefined }))
  }

  const handleGameNumberChange = (number: string) => {
    setGameNumber(number)
    setErrors((prev) => ({ ...prev, gameNumber: undefined }))
  }

  const validateInputs = (): boolean => {
    const newErrors: FormErrors = {}

    if (!walletAddress) {
      newErrors.walletAddress = 'Wallet address is required'
    } else if (!isValidEthereumAddress(walletAddress)) {
      newErrors.walletAddress = 'Invalid Ethereum address'
    }

    if (!gameNumber) {
      newErrors.gameNumber = 'Game number is required'
    } else if (!isValidGameNumber(gameNumber)) {
      newErrors.gameNumber = 'Invalid game number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { winningInfo, isError, isLoading } = useWinningInfo(
    gameNumber,
    walletAddress,
    shouldFetch,
  )

  const {
    handleClaim,
    status: claimStatus,
    isConfirming,
    isConfirmed,
    hash,
    error: claimError,
    reset: resetClaim,
  } = useClaimPrize()

  const handleSearch = () => {
    const isValid = validateInputs()
    if (isValid) {
      setShouldFetch(true)
    }
  }

  const onClaim = async () => {
    await handleClaim(gameNumber)
    // Only refresh winning info after successful claim
    if (claimStatus === 'success' && isConfirmed) {
      setShouldFetch(true)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-4 space-y-6'>
      <SearchSection
        walletAddress={walletAddress}
        setWalletAddress={handleWalletChange}
        gameNumber={gameNumber}
        setGameNumber={handleGameNumberChange}
        handleSearch={handleSearch}
        isLoading={isLoading}
        errors={errors}
      />

      {isError ? (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <h3 className='text-red-800 font-semibold'>Error</h3>
          <p className='text-red-600'>Failed to fetch prize information. Please try again.</p>
        </div>
      ) : (
        shouldFetch &&
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
    </div>
  )
}

export default ClaimPage
