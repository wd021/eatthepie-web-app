'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// Mock data - replace with actual data fetching logic
const mockPastGames = [
  {
    id: 8,
    prizePool: 950,
    winners: 0,
    numbers: 'in progress...',
    claimsStatus: 'Live',
    drawDate: '',
  },
  {
    id: 7,
    prizePool: 950,
    winners: 2,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: 'In progress',
  },
  {
    id: 6,
    prizePool: 950,
    winners: 2,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: '2024-09-18',
  },
  {
    id: 5,
    prizePool: 880,
    winners: 1,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: '2024-09-11',
  },
  {
    id: 4,
    prizePool: 920,
    winners: 3,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: '2024-09-04',
  },
  {
    id: 3,
    prizePool: 950,
    winners: 2,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: '2024-09-18',
  },
  {
    id: 2,
    prizePool: 880,
    winners: 1,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: '2024-09-11',
  },
  {
    id: 1,
    prizePool: 920,
    winners: 3,
    numbers: '12, 42, 52, 34',
    claimsStatus: 'Completed',
    drawDate: '2024-09-04',
  },
]

const PastGamesTable: React.FC<{
  games: typeof mockPastGames
  onRowClick: (id: number) => void
}> = ({ games, onRowClick }) => (
  <div className='w-full overflow-x-auto'>
    <table className='w-full border-collapse bg-white'>
      <thead>
        <tr className='bg-gray-100'>
          <th className='border border-gray-300 p-2 text-left'>Round #</th>
          <th className='border border-gray-300 p-2 text-left'>Status</th>
          <th className='border border-gray-300 p-2 text-left'>Prize Pool</th>
          <th className='border border-gray-300 p-2 text-left'>Winners</th>
          <th className='border border-gray-300 p-2 text-left'>Winning Numbers</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr
            key={game.id}
            onClick={() => onRowClick(game.id)}
            className='cursor-pointer hover:bg-gray-50'
          >
            <td className='border border-gray-300 p-2'>{game.id}</td>
            <td className='border border-gray-300 p-2'>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  game.claimsStatus === 'Live'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {game.claimsStatus}
              </span>
            </td>
            <td className='border border-gray-300 p-2'>{game.prizePool} ETH</td>
            <td className='border border-gray-300 p-2'>{game.winners}</td>
            <td className='border border-gray-300 p-2'>{game.numbers}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const LotteryResultsPage: React.FC = () => {
  const [pastGames, setPastGames] = useState(mockPastGames)
  const router = useRouter()

  const handlePastGameClick = (id: number) => {
    console.log(`Navigating to detailed view for game ${id}`)
    router.push(`/results/${id}`)
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Lottery Results</h1>
      <PastGamesTable games={pastGames} onRowClick={handlePastGameClick} />
    </div>
  )
}

export default LotteryResultsPage
