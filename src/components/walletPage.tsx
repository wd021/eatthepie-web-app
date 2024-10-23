'use client'

import React, { useEffect, useState } from 'react'
import { isAddress } from 'viem'

import useLotteryGameInfo from '@/hooks/useLotteryGameInfo'
import useLotteryInfo from '@/hooks/useLotteryInfo'
import useWalletHistory from '@/hooks/useWalletHistory'
import { Ticket } from '@/icons'

interface WalletHistoryPageProps {
  address: string | null
}

const WalletHistoryPage: React.FC<WalletHistoryPageProps> = ({ address }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [gameNumber, setGameNumber] = useState<string>('')
  const [searchParams, setSearchParams] = useState<{ wallet: string; game: number } | null>(
    null,
  )
  const [validationError, setValidationError] = useState<string | null>(null)

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
    if (searchParams) {
      refetch()
    }
  }, [searchParams, refetch])

  const handleSearch = () => {
    setValidationError(null)

    if (!isAddress(walletAddress)) {
      setValidationError('Invalid wallet address')
      return
    }

    const parsedGameNumber = parseInt(gameNumber)
    if (isNaN(parsedGameNumber) || parsedGameNumber < 0) {
      setValidationError('Game number must be a non-negative integer')
      return
    }

    if (lotteryInfo && parsedGameNumber > lotteryInfo.gameNumber) {
      setValidationError(
        `Game number cannot be greater than the current active game (${lotteryInfo.gameNumber})`,
      )
      return
    }

    setSearchParams({ wallet: walletAddress, game: parsedGameNumber })
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Purchase History</h1>
      <SearchSection
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        gameNumber={gameNumber}
        setGameNumber={setGameNumber}
        handleSearch={handleSearch}
        isLoading={isLoading}
        currentActiveGame={lotteryInfo?.gameNumber}
      />
      {validationError && <ErrorMessage message={validationError} />}
      {error && <ErrorMessage message={error} />}
      <ResultsSection
        isLoading={isLoading || isGameInfoLoading || isLotteryInfoLoading}
        tickets={tickets.slice(0, 500)}
        searchParams={searchParams}
        gameInfo={gameInfo}
      />
    </div>
  )
}

const SearchSection: React.FC<{
  walletAddress: string
  setWalletAddress: (address: string) => void
  gameNumber: string
  setGameNumber: (number: string) => void
  handleSearch: () => void
  isLoading: boolean
}> = ({
  walletAddress,
  setWalletAddress,
  gameNumber,
  setGameNumber,
  handleSearch,
  isLoading,
}) => (
  <div className='bg-white shadow-md rounded-lg overflow-hidden mb-8'>
    <div className='px-6 py-4 bg-gray-50 flex items-center'>
      <Ticket className='w-8 h-8' />
      <h2 className='ml-2 text-2xl font-bold text-gray-800'>Tickets Purchased</h2>
    </div>
    <div className='p-6 grid grid-cols-1 md:grid-cols-12 gap-4'>
      <input
        type='text'
        placeholder='Enter wallet address'
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className='col-span-8 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        type='text'
        placeholder='Game number'
        value={gameNumber}
        onChange={(e) => setGameNumber(e.target.value)}
        className='col-span-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className='col-span-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      >
        {isLoading ? <LoadingSpinner /> : 'Search'}
      </button>
    </div>
  </div>
)

const LoadingSpinner: React.FC = () => (
  <span className='flex items-center justify-center'>
    <svg
      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
    Searching...
  </span>
)

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className='text-red-500 mb-4 p-3 bg-red-100 rounded'>{message}</div>
)

const ResultsSection: React.FC<{
  isLoading: boolean
  tickets: any[]
  searchParams: { wallet: string; game: number } | null
  gameInfo: any
}> = ({ isLoading, tickets, searchParams, gameInfo }) => {
  if (isLoading) return <div className='text-center'>Loading...</div>

  if (tickets.length === 0 && searchParams) {
    return (
      <div className='text-center p-6 bg-gray-50 rounded-lg'>
        <p className='text-lg font-semibold text-gray-700'>
          {searchParams.game > 0 ? 'No tickets purchased.' : "This game hasn't started yet."}
        </p>
      </div>
    )
  }

  if (tickets.length > 0) {
    return (
      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody className='bg-white divide-y divide-gray-200'>
              {tickets.map((ticket, index) => (
                <TableRow
                  key={index}
                  ticket={ticket}
                  winningNumbers={gameInfo?.winningNumbers}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}

const TableHeader: React.FC = () => (
  <thead className='bg-gray-50'>
    <tr>
      {['Ticket Number', 'Block Explorer'].map((header) => (
        <th
          key={header}
          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
)

const TableRow: React.FC<{ ticket: any; winningNumbers: bigint[] | undefined }> = ({
  ticket,
  winningNumbers,
}) => (
  <tr className='hover:bg-gray-50 transition-colors duration-150 ease-in-out'>
    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
      {formatTicketNumbers(ticket.numbers, winningNumbers)}
    </td>
    <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900'>
      <a
        href={`https://etherscan.io/tx/${ticket.transactionHash}`}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center'
      >
        Etherscan
        <svg
          className='ml-1 w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
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

const formatTicketNumbers = (numbers: bigint[], winningNumbers: bigint[] | undefined) => {
  return numbers
    .map((num, index) => {
      const formattedNum = num.toString().padStart(2, '0')
      const isWinning = winningNumbers && winningNumbers[index] === num
      return isWinning ? (
        <strong key={index} className='font-bold'>
          {formattedNum}
        </strong>
      ) : (
        <span key={index}>{formattedNum}</span>
      )
    })
    .reduce((prev, curr, index) => (
      <>
        {prev}
        {index > 0 && ' - '}
        {curr}
      </>
    ))
}

export default WalletHistoryPage
