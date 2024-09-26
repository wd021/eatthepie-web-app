import React, { useState, useEffect } from "react";
import Modal from "react-modal";

// Ensure you set the app element for accessibility
// Modal.setAppElement('#yourAppElement');

interface GameStats {
  gameNumber: number;
  prizePool: number;
  ticketsSold: number;
  timeRemaining: string;
  ticketPrice: number;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  // onPurchase: (tickets: number[][]) => void;
}

const Purchase: React.FC<PurchaseModalProps> = ({
  isOpen,
  onRequestClose,
  // onPurchase,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameStats, setGameStats] = useState<GameStats>({
    gameNumber: 42,
    prizePool: 1000,
    ticketsSold: 5000,
    timeRemaining: "2d 5h 30m",
    ticketPrice: 0.1,
  });
  const [ticketCount, setTicketCount] = useState(1);
  const [manualNumbers, setManualNumbers] = useState<number[][]>([
    Array(4).fill(null),
  ]);
  const [isAutoGenerate, setIsAutoGenerate] = useState(false);

  useEffect(() => {
    // Fetch current game stats here
    // setGameStats(fetchedGameStats);
  }, []);

  const handleNumberChange = (
    ticketIndex: number,
    numberIndex: number,
    value: number
  ) => {
    const newManualNumbers = [...manualNumbers];
    newManualNumbers[ticketIndex][numberIndex] = value;
    setManualNumbers(newManualNumbers);
  };

  const handleTicketCountChange = (count: number) => {
    setTicketCount(count);
    setManualNumbers(
      Array(count)
        .fill(0)
        .map(() => Array(4).fill(null))
    );
  };

  const generateRandomNumbers = () => {
    return Array(4)
      .fill(0)
      .map(() => Math.floor(Math.random() * 50) + 1);
  };

  const handlePurchase = () => {
    let tickets: number[][];
    if (isAutoGenerate) {
      tickets = Array(ticketCount).fill(0).map(generateRandomNumbers);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tickets = manualNumbers.map((ticket) =>
        ticket.map((num) =>
          num === null ? Math.floor(Math.random() * 50) + 1 : num
        )
      );
    }
    // onPurchase(tickets);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Buy Ticket Modal"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 max-w-2xl w-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-3xl font-bold mb-6">
        Buy Tickets for Game #{gameStats.gameNumber}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Prize Pool</p>
          <p className="text-xl font-semibold">{gameStats.prizePool} ETH</p>
        </div>
        <div>
          <p className="text-gray-600">Tickets Sold</p>
          <p className="text-xl font-semibold">{gameStats.ticketsSold}</p>
        </div>
        <div>
          <p className="text-gray-600">Time Remaining</p>
          <p className="text-xl font-semibold">{gameStats.timeRemaining}</p>
        </div>
        <div>
          <p className="text-gray-600">Ticket Price</p>
          <p className="text-xl font-semibold">{gameStats.ticketPrice} ETH</p>
        </div>
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="ticketCount"
        >
          Number of Tickets
        </label>
        <input
          id="ticketCount"
          type="number"
          min="1"
          max="100"
          value={ticketCount}
          onChange={(e) => handleTicketCountChange(parseInt(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAutoGenerate}
            onChange={() => setIsAutoGenerate(!isAutoGenerate)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Auto-generate numbers</span>
        </label>
      </div>

      {!isAutoGenerate && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Select Your Numbers</h3>
          {manualNumbers.map((ticket, ticketIndex) => (
            <div key={ticketIndex} className="mb-4">
              <p className="text-gray-600 mb-2">Ticket {ticketIndex + 1}</p>
              <div className="flex space-x-2">
                {ticket.map((num, numIndex) => (
                  <input
                    key={numIndex}
                    type="number"
                    min="1"
                    max="50"
                    value={num || ""}
                    onChange={(e) =>
                      handleNumberChange(
                        ticketIndex,
                        numIndex,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-14 h-14 text-center border rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">
          Total: {(ticketCount * gameStats.ticketPrice).toFixed(2)} ETH
        </p>
        <div>
          <button
            onClick={onRequestClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Purchase Tickets
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Purchase;
