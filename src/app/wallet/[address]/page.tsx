'use client'

import React, { useEffect, useState } from 'react'

// Updated mock data structure
const mockWalletData = {
  address: '0x1234...5678',
  totalSpent: 10.5,
  totalWon: 25.0,
  ticketsPurchased: 105,
  gamesPlayed: 42,
  consecutiveGamesPlayed: 15,
}

const mockGameHistory = [
  {
    gameId: 42,
    drawDate: '2024-09-25T20:00:00Z',
    status: 'Completed',
    winningNumbers: [7, 13, 25, 31, 42, 3],
    userWinnings: {
      highestPrize: '3 in a row',
      prizeAmount: 100,
      loyaltyEligible: true,
    },
    tickets: [
      {
        ticketId: 'T001',
        numbers: [7, 13, 25, 31, 42, 3],
        status: '3 in a row',
      },
      {
        ticketId: 'T002',
        numbers: [3, 11, 19, 27, 35, 5],
        status: '2 in a row',
      },
      {
        ticketId: 'T003',
        numbers: [1, 8, 15, 22, 29, 6],
        status: 'Lost',
      },
    ],
  },
  // Add more mock data as needed
]

const WalletHistoryPage = () => {
  const [walletData, setWalletData] = useState(mockWalletData)
  const [gameHistory, setGameHistory] = useState(mockGameHistory)
  const [selectedGameId, setSelectedGameId] = useState(mockGameHistory[0].gameId)
  const [searchGameId, setSearchGameId] = useState('')

  useEffect(() => {
    // Fetch wallet data and game history here
    // setWalletData(fetchedWalletData);
    // setGameHistory(fetchedGameHistory);
    // setSelectedGameId(fetchedGameHistory[0].gameId);
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const renderNumbers = (numbers) => {
    const [main, etherball] = [numbers.slice(0, -1), numbers.slice(-1)]
    return (
      <div className='flex space-x-1'>
        {main.map((num, index) => (
          <div
            key={index}
            className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
          >
            {num}
          </div>
        ))}
        <div className='bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'>
          {etherball}
        </div>
      </div>
    )
  }

  const handleGameSearch = (e) => {
    e.preventDefault()
    const gameId = parseInt(searchGameId)
    if (gameHistory.some((game) => game.gameId === gameId)) {
      setSelectedGameId(gameId)
    } else {
      alert('Game not found')
    }
  }

  const selectedGame = gameHistory.find((game) => game.gameId === selectedGameId)

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>Wallet History</h1>

      {/* Updated Wallet Overview section */}
      <div className='bg-white shadow-md rounded-lg overflow-hidden mb-8'>
        <h2 className='text-2xl font-semibold p-4 bg-gray-100'>Wallet Overview</h2>
        <div className='p-6'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            <div>
              <p className='text-gray-600'>Address</p>
              <p className='text-xl font-semibold'>{walletData.address}</p>
            </div>
            <div>
              <p className='text-gray-600'>Total Spent</p>
              <p className='text-xl font-semibold'>{walletData.totalSpent} ETH</p>
            </div>
            <div>
              <p className='text-gray-600'>Total Won</p>
              <p className='text-xl font-semibold'>{walletData.totalWon} ETH</p>
            </div>
            <div>
              <p className='text-gray-600'>Tickets Purchased</p>
              <p className='text-xl font-semibold'>{walletData.ticketsPurchased}</p>
            </div>
            <div>
              <p className='text-gray-600'>Games Played</p>
              <p className='text-xl font-semibold'>{walletData.gamesPlayed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Game History section */}
      <div className='bg-white shadow-md rounded-lg overflow-hidden mb-8'>
        <div className='p-4 bg-gray-100 flex justify-between items-center'>
          <h2 className='text-2xl font-semibold'>Game History</h2>
          <form onSubmit={handleGameSearch} className='flex items-center'>
            <input
              type='number'
              value={searchGameId}
              onChange={(e) => setSearchGameId(e.target.value)}
              placeholder='Enter game number'
              className='px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Search
            </button>
          </form>
        </div>
        {selectedGame && (
          <div className='p-6'>
            <h3 className='text-xl font-semibold mb-2'>Round #{selectedGame.gameId}</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div>
                <p className='text-gray-600'>Draw Date</p>
                <p className='font-semibold'>{formatDate(selectedGame.drawDate)}</p>
              </div>
              <div>
                <p className='text-gray-600'>Status</p>
                <p className='font-semibold'>{selectedGame.status}</p>
              </div>
              <div>
                <p className='text-gray-600'>Winning Numbers</p>
                {renderNumbers(selectedGame.winningNumbers)}
              </div>
            </div>

            <div className='bg-gray-50 p-4 rounded-md mb-6'>
              <h4 className='text-lg font-semibold mb-2'>Your Winnings</h4>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600'>Highest Prize Won</p>
                  <p className='text-xl font-semibold'>
                    {selectedGame.userWinnings.highestPrize}
                  </p>
                  <p className='text-green-600 font-semibold'>
                    {selectedGame.userWinnings.prizeAmount} ETH
                  </p>
                </div>
                <div className='space-y-2'>
                  <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full'>
                    Claim Prize
                  </button>
                  <button
                    className={`${
                      selectedGame.userWinnings.loyaltyEligible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    } text-white px-4 py-2 rounded w-full`}
                    disabled={!selectedGame.userWinnings.loyaltyEligible}
                  >
                    Claim Loyalty Prize
                  </button>
                </div>
              </div>
            </div>

            <h4 className='text-lg font-semibold mb-2'>Your Tickets</h4>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Ticket #
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Numbers
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {selectedGame.tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap'>{ticket.ticketId}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {renderNumbers(ticket.numbers)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.status === 'Lost'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletHistoryPage
