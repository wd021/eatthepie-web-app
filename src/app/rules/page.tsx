"use client";

import { FC, useState } from "react";

const Icon: React.FC<{ name: string }> = ({ name }) => {
  // Simple SVG icons
  const icons: { [key: string]: JSX.Element } = {
    pieChart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    clock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    ticket: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
        <path d="M13 5v2"></path>
        <path d="M13 17v2"></path>
        <path d="M13 11v2"></path>
      </svg>
    ),
    alertCircle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    ),
    award: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    ),
    coins: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="7"></circle>
        <path d="M19.5 9.5c.5-1.2 0-2.7-1.1-3.8C17.3 4.6 15.9 4 14.7 4.5"></path>
        <path d="M14.7 14.5c1.2.5 2.6.1 3.7-1.1 1.1-1.1 1.6-2.6 1.1-3.8"></path>
      </svg>
    ),
  };

  return icons[name] || null;
};

const Card: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <Icon name={icon} />
      <span className="ml-2">{title}</span>
    </h2>
    {children}
  </div>
);

const Accordion: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left py-4 flex items-center justify-between focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <Icon name={icon} />
          <span className="ml-2 font-semibold">{title}</span>
        </span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
};

const Rules: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="How to Play" icon="pieChart">
          <p>
            Choose your numbers and buy tickets to join the excitement! Match
            the winning numbers to win big prizes.
          </p>
        </Card>

        <Card title="Draw Schedule" icon="clock">
          <p>
            Draws occur weekly, with a minimum prize pool of 500 ETH. Stay tuned
            for the next big draw!
          </p>
        </Card>
      </div>

      <div className="mb-8">
        <Accordion title="Ticket Types and Prizes" icon="ticket">
          <ul className="list-disc pl-5">
            <li>
              <strong>Gold Ticket:</strong> Match all numbers and the Etherball
              (60% of prize pool)
            </li>
            <li>
              <strong>Silver Ticket:</strong> Match all numbers without the
              Etherball (25% of prize pool)
            </li>
            <li>
              <strong>Bronze Ticket:</strong> Match the first two numbers (10%
              of prize pool)
            </li>
            <li>
              <strong>Loyalty Prize:</strong> For the most consistent players
              (4% of prize pool)
            </li>
          </ul>
        </Accordion>

        <Accordion title="Difficulty Levels" icon="alertCircle">
          <p>The game adjusts its difficulty based on recent outcomes:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Easy:</strong> Choose from 1-50 for main numbers, 1-5 for
              Etherball
            </li>
            <li>
              <strong>Medium:</strong> Choose from 1-100 for main numbers, 1-10
              for Etherball
            </li>
            <li>
              <strong>Hard:</strong> Choose from 1-150 for main numbers, 1-15
              for Etherball
            </li>
          </ul>
        </Accordion>

        <Accordion title="Winning and Claiming Prizes" icon="award">
          <p>After each draw:</p>
          <ul className="list-disc pl-5">
            <li>
              Winning numbers are determined using a verifiable random function
              (VDF)
            </li>
            <li>Players can claim their prizes through the smart contract</li>
            <li>
              Jackpot winners receive a unique NFT to commemorate their win
            </li>
            <li>Unclaimed prizes roll over to the next game after one year</li>
          </ul>
        </Accordion>
      </div>

      <Card title="Ticket Pricing and Fees" icon="coins">
        <p>
          Ticket prices may vary. A small fee (max 1% or 100 ETH) is deducted
          from each draw to support the game&apos;s operations.
        </p>
      </Card>
    </div>
  );
};

export default Rules;
