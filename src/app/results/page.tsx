'use client'

import React from 'react'
import Link from 'next/link'
import { formatEther } from 'viem'

import { useLotteryResults } from '@/hooks'

const LotteryResultsPage: React.FC = () => {
  const { games, hasMore, isLoading, loadMore } = useLotteryResults()

  const formatPrizePool = (prizePool: bigint) => {
    return `${parseFloat(formatEther(prizePool)).toFixed(1)} ETH`
  }

  const formatWinningNumbers = (numbers: bigint[]) => {
    return numbers.map((n) => n.toString().padStart(2, '0')).join(' - ')
  }

  const getStatusString = (status: number) => {
    switch (status) {
      case 0:
        return 'In Play'
      case 1:
        return 'Drawing'
      case 2:
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-blue-100 text-blue-800'
      case 1:
        return 'bg-yellow-100 text-yellow-800'
      case 2:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Lottery Results</h1>
      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Round #
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Prize Pool
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Winners
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Winning Numbers
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {games.map((game) => (
                <tr
                  key={game.gameId.toString()}
                  className='hover:bg-gray-50 transition-colors duration-150 ease-in-out'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {game.gameId.toString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(game.status)}`}
                    >
                      {getStatusString(game.status)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatPrizePool(game.prizePool)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {Number(game.winningNumbers[0]) !== 0
                      ? game.numberOfWinners.toString()
                      : '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {Number(game.winningNumbers[0]) !== 0
                      ? formatWinningNumbers(game.winningNumbers)
                      : '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <Link
                      href={`/results/${game.gameId.toString()}`}
                      className='text-gray-600 hover:text-gray-900'
                    >
                      <svg
                        className='w-5 h-5 inline-block'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='mt-8 flex justify-center'>
        {isLoading ? (
          <div className='flex items-center text-gray-500'>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500'
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
            Loading...
          </div>
        ) : hasMore ? (
          <button
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out flex items-center'
            onClick={loadMore}
            disabled={isLoading}
          >
            Load More
            <svg
              className='ml-2 w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        ) : (
          <p className='text-gray-500'>No more results to load.</p>
        )}
      </div>
    </div>
  )
}

export default LotteryResultsPage
