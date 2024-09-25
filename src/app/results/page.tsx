"use client";

import React, { useState, useEffect } from "react";

// Mock data - replace with actual data fetching logic
const mockActiveGame = {
  roundNumber: 42,
  jackpotSize: 1000,
  timeUntilDraw: 86400, // seconds
  ticketsSold: 5000,
  yourTickets: 3,
};

const mockPastGames = [
  {
    id: 41,
    prizePool: 950,
    winners: 2,
    claimsStatus: "Completed",
    drawDate: "2024-09-18",
  },
  {
    id: 40,
    prizePool: 880,
    winners: 1,
    claimsStatus: "In Progress",
    drawDate: "2024-09-11",
  },
  {
    id: 39,
    prizePool: 920,
    winners: 3,
    claimsStatus: "Completed",
    drawDate: "2024-09-04",
  },
];

// Utility function to format time
const formatTime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const ActiveGameBox: React.FC<{
  game: typeof mockActiveGame;
  onBuyTicket: () => void;
}> = ({ game, onBuyTicket }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">
        Active Game: Round #{game.roundNumber}
      </h2>
      <button
        onClick={onBuyTicket}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Buy Ticket
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-gray-600">Jackpot Size</p>
        <p className="text-xl font-semibold">{game.jackpotSize} ETH</p>
      </div>
      <div>
        <p className="text-gray-600">Time Until Draw</p>
        <p className="text-xl font-semibold">
          {formatTime(game.timeUntilDraw)}
        </p>
      </div>
      <div>
        <p className="text-gray-600">Tickets Sold</p>
        <p className="text-xl font-semibold">{game.ticketsSold}</p>
      </div>
      <div>
        <p className="text-gray-600">Your Tickets</p>
        <p className="text-xl font-semibold">{game.yourTickets}</p>
      </div>
    </div>
  </div>
);

const PastGamesTable: React.FC<{
  games: typeof mockPastGames;
  onRowClick: (id: number) => void;
}> = ({ games, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4 text-left">Game #</th>
          <th className="py-2 px-4 text-left">Prize Pool</th>
          <th className="py-2 px-4 text-left">Winners</th>
          <th className="py-2 px-4 text-left">Claims Status</th>
          <th className="py-2 px-4 text-left">Draw Date</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr
            key={game.id}
            onClick={() => onRowClick(game.id)}
            className="cursor-pointer hover:bg-gray-50"
          >
            <td className="py-2 px-4">{game.id}</td>
            <td className="py-2 px-4">{game.prizePool} ETH</td>
            <td className="py-2 px-4">{game.winners}</td>
            <td className="py-2 px-4">{game.claimsStatus}</td>
            <td className="py-2 px-4">{game.drawDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LotteryResultsPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState(mockActiveGame);
  const [pastGames, setPastGames] = useState(mockPastGames);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulating real-time updates
    const timer = setInterval(() => {
      setActiveGame((prev) => ({
        ...prev,
        timeUntilDraw: Math.max(0, prev.timeUntilDraw - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBuyTicket = () => {
    setIsExpanded(!isExpanded);
    // Implement ticket purchase logic here
    console.log("Buy ticket clicked");
  };

  const handlePastGameClick = (id: number) => {
    // Implement navigation to detailed game page
    console.log(`Navigating to detailed view for game ${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Lottery Results</h1>

      <ActiveGameBox game={activeGame} onBuyTicket={handleBuyTicket} />

      {isExpanded && (
        <div className="bg-gray-100 p-6 mb-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Detailed Game Information</h2>
          {/* Add more detailed game information and ticket purchase form here */}
          <p>
            Expanded view for detailed game information and ticket purchase.
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Past Games</h2>
      <PastGamesTable games={pastGames} onRowClick={handlePastGameClick} />
    </div>
  );
};

export default LotteryResultsPage;
