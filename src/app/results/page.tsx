"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Mock data - replace with actual data fetching logic
const mockPastGames = [
  {
    id: 8,
    prizePool: 950,
    winners: 2,
    claimsStatus: "In progress",
    drawDate: "",
  },
  {
    id: 7,
    prizePool: 950,
    winners: 2,
    claimsStatus: "Completed",
    drawDate: "In progress",
  },
  {
    id: 6,
    prizePool: 950,
    winners: 2,
    claimsStatus: "Completed",
    drawDate: "2024-09-18",
  },
  {
    id: 5,
    prizePool: 880,
    winners: 1,
    claimsStatus: "Completed",
    drawDate: "2024-09-11",
  },
  {
    id: 4,
    prizePool: 920,
    winners: 3,
    claimsStatus: "Completed",
    drawDate: "2024-09-04",
  },
  {
    id: 3,
    prizePool: 950,
    winners: 2,
    claimsStatus: "Completed",
    drawDate: "2024-09-18",
  },
  {
    id: 2,
    prizePool: 880,
    winners: 1,
    claimsStatus: "Completed",
    drawDate: "2024-09-11",
  },
  {
    id: 1,
    prizePool: 920,
    winners: 3,
    claimsStatus: "Completed",
    drawDate: "2024-09-04",
  },
];

const PastGamesTable: React.FC<{
  games: typeof mockPastGames;
  onRowClick: (id: number) => void;
}> = ({ games, onRowClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4 text-left">Round #</th>
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
            className="cursor-pointer hover:bg-gray-50 border-b border-gray-100 h-[50px]"
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pastGames, setPastGames] = useState(mockPastGames);
  const router = useRouter();

  const handlePastGameClick = (id: number) => {
    // Implement navigation to detailed game page
    console.log(`Navigating to detailed view for game ${id}`);
    router.push(`/results/1`);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 py-12">
      <PastGamesTable games={pastGames} onRowClick={handlePastGameClick} />
    </div>
  );
};

export default LotteryResultsPage;
