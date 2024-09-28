"use client";

import React, { useState, useEffect } from "react";

// Updated mock data structure
const mockWalletData = {
  address: "0x1234...5678",
  totalSpent: 10.5,
  totalWon: 25.0,
  ticketsPurchased: 105,
  gamesPlayed: 42,
};

const mockGameHistory = [
  {
    gameId: 42,
    drawDate: "2024-09-25T20:00:00Z",
    status: "Completed",
    tickets: [
      {
        purchaseDate: "2024-09-25T15:30:00Z",
        numbers: [7, 13, 25, 31, 42, 3],
        status: "Won",
        prize: 15.0,
        prizeType: "Silver",
      },
      {
        purchaseDate: "2024-09-25T16:45:00Z",
        numbers: [3, 11, 19, 27, 35, 5],
        status: "Lost",
        prize: 0,
        prizeType: null,
      },
    ],
  },
  {
    gameId: 41,
    drawDate: "2024-09-18T20:00:00Z",
    status: "Completed",
    tickets: [
      {
        purchaseDate: "2024-09-18T14:45:00Z",
        numbers: [5, 11, 22, 33, 44, 4],
        status: "Lost",
        prize: 0,
        prizeType: null,
      },
    ],
  },
  // Add more mock data as needed
];

const WalletHistoryPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [walletData, setWalletData] = useState(mockWalletData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameHistory, setGameHistory] = useState(mockGameHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    // Fetch wallet data and game history here
    // setWalletData(fetchedWalletData);
    // setGameHistory(fetchedGameHistory);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderTicketNumbers = (numbers: number[]) => {
    const [main, etherball] = [numbers.slice(0, -1), numbers.slice(-1)];
    return (
      <div className="flex space-x-1">
        {main.map((num, index) => (
          <div
            key={index}
            className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            {num}
          </div>
        ))}
        <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {etherball}
        </div>
      </div>
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = gameHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Wallet History</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Wallet Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600">Address</p>
            <p className="text-xl font-semibold">{walletData.address}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Spent</p>
            <p className="text-xl font-semibold">{walletData.totalSpent} ETH</p>
          </div>
          <div>
            <p className="text-gray-600">Total Won</p>
            <p className="text-xl font-semibold">{walletData.totalWon} ETH</p>
          </div>
          <div>
            <p className="text-gray-600">Tickets Purchased</p>
            <p className="text-xl font-semibold">
              {walletData.ticketsPurchased}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Game History</h2>
        {currentItems.map((game, gameIndex) => (
          <div key={gameIndex} className="mb-8 border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">Round #{game.gameId}</h3>
            <p className="mb-2">Draw Date: {formatDate(game.drawDate)}</p>
            <p className="mb-4">Status: {game.status}</p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Purchase Date</th>
                    <th className="py-2 px-4 text-left">Numbers</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {game.tickets.map((ticket, ticketIndex) => (
                    <tr
                      key={ticketIndex}
                      className={ticket.status === "Won" ? "bg-green-100" : ""}
                    >
                      <td className="py-2 px-4">
                        {formatDate(ticket.purchaseDate)}
                      </td>
                      <td className="py-2 px-4">
                        {renderTicketNumbers(ticket.numbers)}
                      </td>
                      <td className="py-2 px-4">
                        {ticket.status === "Won" ? (
                          <span className="text-green-600 font-semibold">
                            {ticket.status} ({ticket.prizeType})
                          </span>
                        ) : (
                          <span className="text-red-600">{ticket.status}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {ticket.prize > 0 ? `${ticket.prize} ETH` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          {Array.from({
            length: Math.ceil(gameHistory.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletHistoryPage;
