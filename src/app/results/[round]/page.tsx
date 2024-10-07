"use client";

import React, { useState, useEffect } from "react";

// Mock data - replace with actual data fetching logic
const mockGameData = {
  id: 42,
  status: "Completed", // 'Active', 'Completed', 'Claiming'
  prizePool: 1000,
  difficulty: "Medium",
  drawDate: "2024-09-25T20:00:00Z",
  winningNumbers: [7, 13, 25, 31], // Last number is Etherball
  winners: {
    gold: [{ address: "0x1234...5678", prize: 600, claimed: false }],
    silver: [
      { address: "0x2345...6789", prize: 250, claimed: true },
      { address: "0x3456...7890", prize: 250, claimed: false },
    ],
    bronze: [
      { address: "0x4567...8901", prize: 33.33, claimed: true },
      { address: "0x5678...9012", prize: 33.33, claimed: false },
      { address: "0x6789...0123", prize: 33.33, claimed: true },
    ],
    loyalty: [{ address: "0x7890...1234", prize: 40, claimed: false }],
  },
};

const GameDetailsComponent = () => {
  const [gameData, setGameData] = useState(mockGameData);
  const [connectedWallet, setConnectedWallet] = useState("0x1234...5678"); // Mock connected wallet

  useEffect(() => {
    // Fetch game data here
    // setGameData(fetchedData);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderWinningNumbers = () => {
    const [main, etherball] = [
      gameData.winningNumbers.slice(0, -1),
      gameData.winningNumbers.slice(-1),
    ];
    return (
      <div className="flex justify-center space-x-4 mt-4">
        {main.map((num, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-semibold"
          >
            {num}
          </div>
        ))}
        <div className="bg-gray-800 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-semibold">
          {etherball}
        </div>
      </div>
    );
  };

  const renderWinnersTable = (title, winners) => {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">
          {title} Winners
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prize (ETH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {winners.map((winner, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {winner.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {winner.prize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {winner.claimed ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Claimed
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Unclaimed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {winner.address === connectedWallet && !winner.claimed && (
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Claim
                      </button>
                    )}
                  </td>
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
      <h2 className="text-4xl font-bold text-center p-4">
        Round #{gameData.id}
      </h2>
      {renderWinningNumbers()}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 mt-8">
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600">Status</p>
              <p className="text-xl font-semibold">{gameData.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Prize Pool</p>
              <p className="text-xl font-semibold">{gameData.prizePool} ETH</p>
            </div>
            <div>
              <p className="text-gray-600">Difficulty</p>
              <p className="text-xl font-semibold">{gameData.difficulty}</p>
            </div>
            <div>
              <p className="text-gray-600">Draw Date</p>
              <p className="text-xl font-semibold">
                {formatDate(gameData.drawDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {renderWinnersTable("Gold", gameData.winners.gold)}
      {renderWinnersTable("Silver", gameData.winners.silver)}
      {renderWinnersTable("Bronze", gameData.winners.bronze)}
      {renderWinnersTable("Loyalty", gameData.winners.loyalty)}
    </div>
  );
};

export default GameDetailsComponent;
