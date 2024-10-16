'use client'

import React, { useEffect, useState } from 'react'
import { isAddress } from 'viem'

import useWalletHistory from '@/hooks/useWalletHistory'

interface WalletHistoryPageProps {
  wallet?: string
}

const WalletHistoryPage: React.FC<WalletHistoryPageProps> = ({ wallet }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [gameNumber, setGameNumber] = useState<string>('1')
  const [searchParams, setSearchParams] = useState<{ wallet: string; game: number } | null>(
    null,
  )

  const { tickets, isLoading, error, refetch } = useWalletHistory({
    walletAddress: walletAddress as `0x${string}`,
    gameNumber: parseInt(gameNumber),
  })

  useEffect(() => {
    if (wallet && isAddress(wallet)) {
      setWalletAddress(wallet)
    }
  }, [wallet])

  useEffect(() => {
    if (searchParams) {
      refetch()
    }
  }, [searchParams, refetch])

  const handleSearch = () => {
    if (isAddress(walletAddress) && gameNumber) {
      setSearchParams({ wallet: walletAddress, game: parseInt(gameNumber) })
    } else {
      // Handle invalid input
      console.error('Invalid wallet address or game number', walletAddress, gameNumber)
    }
  }

  return (
    <div className='container max-w-4xl	mx-auto px-4 py-8'>
      <div className='flex items-center mb-6'>
        <svg
          className='w-8 h-8 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
          />
        </svg>
        <h1 className='text-2xl font-bold'>Wallet History</h1>
      </div>

      <div className='mb-6'>
        <input
          type='text'
          placeholder='Enter wallet address'
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className='w-full p-2 mb-2 border border-gray-300 rounded'
        />
        <div className='flex'>
          <input
            type='number'
            placeholder='Enter game number'
            value={gameNumber}
            onChange={(e) => setGameNumber(e.target.value)}
            className='w-full p-2 mr-2 border border-gray-300 rounded'
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'
          >
            {isLoading ? (
              <span className='flex items-center'>
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
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {error && <div className='text-red-500 mb-4'>{error}</div>}

      {!isLoading && tickets.length > 0 && (
        <table className='w-full border-collapse border border-gray-300 bg-white text-center'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 p-2'>Ticket Cost</th>
              <th className='border border-gray-300 p-2'>Ticket Number</th>
              <th className='border border-gray-300 p-2'>Status</th>
              <th className='border border-gray-300 p-2'>Block Explorer</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td className='border border-gray-300 p-2'>{ticket.cost}</td>
                <td className='border border-gray-300 p-2'>{ticket.numbers.join(', ')}</td>
                <td className='border border-gray-300 p-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ticket.claimsStatus === 'Live'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className='border border-gray-300 p-2'>
                  <a
                    href={`https://etherscan.io/tx/${ticket.transactionHash}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:text-blue-700'
                  >
                    Etherscan
                    <svg
                      className='ml-1 w-4 h-4 inline'
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
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && tickets.length === 0 && searchParams && (
        <div className='text-center p-4 bg-gray-100 rounded-lg'>
          <p className='text-lg font-semibold'>
            {searchParams.game > 0
              ? "You haven't purchased any tickets for this game."
              : "This game hasn't started yet."}
          </p>
        </div>
      )}
    </div>
  )
}

export default WalletHistoryPage
