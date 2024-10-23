'use client'

import React, { useEffect, useState } from 'react'
import { isAddress } from 'viem'
import { useLotteryGameInfo, useLotteryInfo, useWalletHistory } from '@/hooks'
import { SearchContainer } from '@/components'
import { BasicTicket } from '@/utils/types'

// Types
interface WalletHistoryPageProps {
  address: string | null
}

interface SearchParams {
  wallet: string
  game: number
}

interface Ticket {
  numbers: bigint[]
  transactionHash: string
}

// Components
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

const TableHeader: React.FC = () => (
  <thead className='bg-gray-50'>
    <tr>
      <th
        scope='col'
        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
      >
        Ticket Number
      </th>
      <th
        scope='col'
        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
      >
        Transaction
      </th>
    </tr>
  </thead>
)

const TableRow: React.FC<{ ticket: BasicTicket }> = ({ ticket }) => (
  <tr className='hover:bg-gray-50 transition-colors duration-150'>
    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
      {formatTicketNumbers(ticket.numbers)}
    </td>
    <td className='px-6 py-4 whitespace-nowrap text-sm'>
      <a
        href={`https://etherscan.io/tx/${ticket.transactionHash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center text-blue-600 hover:text-blue-800'
      >
        View on Etherscan
        <svg className='ml-1 h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
          />
        </svg>
      </a>
    </td>
  </tr>
)

const LoadingState: React.FC = () => (
  <div className='p-8'>
    <div className='flex flex-col items-center justify-center mt-4'>
      <p className='text-gray-600 text-sm'>Loading tickets...</p>
    </div>
  </div>
)

const EmptyState: React.FC<{ gameStarted: boolean }> = ({ gameStarted }) => (
  <div className='p-8'>
    <div className='text-center'>
      <h3 className='mt-4 text-sm font-medium text-gray-900'>
        {gameStarted ? 'No tickets found for this game' : "This game hasn't started yet"}
      </h3>
    </div>
  </div>
)

const ResultsSection: React.FC<{
  isLoading: boolean
  tickets: BasicTicket[]
  searchParams: SearchParams | null
  gameInfo: any
}> = ({ isLoading, tickets, searchParams, gameInfo }) => {
  if (!searchParams) return null
  if (isLoading) return <LoadingState />
  if (tickets.length === 0) return <EmptyState gameStarted={searchParams.game > 0} />

  return (
    <div className='bg-white rounded-lg shadow-md'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>
            Found {tickets.length}
            {tickets.length === 500 && '+'} tickets • Game #{searchParams.game}
          </span>
        </div>
      </div>
      <div className='overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <TableHeader />
          <tbody className='bg-white divide-y divide-gray-200'>
            {tickets.map((ticket, index) => (
              <TableRow key={index} ticket={ticket} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Utilities
const formatTicketNumbers = (numbers: Number[]) => {
  return numbers
    .map((num, index) => {
      const formattedNum = num.toString().padStart(2, '0')
      return <span key={index}>{formattedNum}</span>
    })
    .reduce((prev, curr, index) => (
      <>
        {prev}
        {index > 0 && ' - '}
        {curr}
      </>
    ))
}

// Main Component
const WalletPage: React.FC<WalletHistoryPageProps> = ({ address }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [gameNumber, setGameNumber] = useState<string>('')
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const { tickets, isLoading, error, refetch } = useWalletHistory({
    walletAddress: searchParams?.wallet as `0x${string}`,
    gameNumber: searchParams?.game || 0,
  })

  const { gameInfo, isLoading: isGameInfoLoading } = useLotteryGameInfo(
    BigInt(searchParams?.game || 0),
  )
  const { lotteryInfo, isLoading: isLotteryInfoLoading } = useLotteryInfo()

  useEffect(() => {
    if (address && isAddress(address)) {
      setWalletAddress(address)
    }
  }, [address])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (searchParams) {
      setIsSearching(true)
      timeout = setTimeout(() => {
        refetch()
        setIsSearching(false)
      }, 500)
    }
    return () => clearTimeout(timeout)
  }, [searchParams, refetch])

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
      setSearchParams({
        wallet: walletAddress,
        game: parseInt(gameNumber),
      })
    }
  }

  const isLoadingState = isSearching || isLoading || isGameInfoLoading || isLotteryInfoLoading

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <SearchContainer
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        gameNumber={gameNumber}
        setGameNumber={setGameNumber}
        handleSearch={handleSearch}
        isLoading={isLoadingState}
        isSearching={isSearching}
      />

      {validationError && <ErrorMessage message={validationError} />}
      {error && <ErrorMessage message={error} />}

      <ResultsSection
        isLoading={isLoadingState}
        tickets={tickets.slice(0, 500)}
        searchParams={searchParams}
        gameInfo={gameInfo}
      />
    </div>
  )
}

export default WalletPage
