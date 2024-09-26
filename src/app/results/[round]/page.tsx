"use client";

import React, { useState, useEffect } from "react";

// Mock data - replace with actual data fetching logic
const mockGameData = {
  id: 42,
  status: "Completed", // 'Active', 'Completed', 'Claiming'
  prizePool: 1000,
  ticketsSold: 5000,
  drawDate: "2024-09-25T20:00:00Z",
  winningNumbers: [7, 13, 25, 31, 42, 3], // Last number is Etherball
  winners: {
    gold: [{ address: "0x1234...5678", prize: 600 }],
    silver: [
      { address: "0x2345...6789", prize: 250 },
      { address: "0x3456...7890", prize: 250 },
    ],
    bronze: [
      { address: "0x4567...8901", prize: 33.33 },
      { address: "0x5678...9012", prize: 33.33 },
      { address: "0x6789...0123", prize: 33.33 },
    ],
    loyalty: [{ address: "0x7890...1234", prize: 40 }],
  },
};

const DetailedGamePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameData, setGameData] = useState(mockGameData);

  useEffect(() => {
    // Fetch game data here
    // setGameData(fetchedData);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderWinningNumbers = () => {
    if (!gameData.winningNumbers) return null;
    const [main, etherball] = [
      gameData.winningNumbers.slice(0, -1),
      gameData.winningNumbers.slice(-1),
    ];
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Winning Numbers</h3>
        <div className="flex space-x-2">
          {main.map((num, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              {num}
            </div>
          ))}
          <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            {etherball}
          </div>
        </div>
      </div>
    );
  };

  const renderWinnersTable = (
    title: string,
    winners: typeof mockGameData.winners.gold
  ) => {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{title} Winners</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Rank</th>
                <th className="py-2 px-4 text-left">Wallet Address</th>
                <th className="py-2 px-4 text-left">Prize (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr key={index}>
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{winner.address}</td>
                  <td className="py-2 px-4">{winner.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Game #{gameData.id} Details
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Status</p>
            <p className="text-xl font-semibold">{gameData.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Prize Pool</p>
            <p className="text-xl font-semibold">{gameData.prizePool} ETH</p>
          </div>
          <div>
            <p className="text-gray-600">Tickets Sold</p>
            <p className="text-xl font-semibold">{gameData.ticketsSold}</p>
          </div>
          <div>
            <p className="text-gray-600">Draw Date</p>
            <p className="text-xl font-semibold">
              {formatDate(gameData.drawDate)}
            </p>
          </div>
        </div>

        {gameData.status !== "Active" && renderWinningNumbers()}

        {gameData.status === "Completed" && (
          <>
            {renderWinnersTable("Gold", gameData.winners.gold)}
            {renderWinnersTable("Silver", gameData.winners.silver)}
            {renderWinnersTable("Bronze", gameData.winners.bronze)}
            {renderWinnersTable("Loyalty", gameData.winners.loyalty)}
          </>
        )}

        {gameData.status === "Active" && (
          <div className="text-center">
            <p className="text-xl mb-4">
              The draw for this game has not yet occurred.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Buy Tickets
            </button>
          </div>
        )}

        {gameData.status === "Claiming" && (
          <div className="text-center">
            <p className="text-xl mb-4">Winners can now claim their prizes!</p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Claim Prize
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedGamePage;
