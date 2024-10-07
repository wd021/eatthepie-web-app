import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "@/icons";
import { trimAddress } from "@/utils/helpers";
import { useAccount, useDisconnect } from "wagmi";

const WalletDropdown: React.FC<{ purchaseTicket: () => void }> = ({
  purchaseTicket,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBuyTickets = () => {
    // Implement buy tickets logic
    purchaseTicket();
    setIsOpen(false);
  };

  const handleWalletHistory = () => {
    // Implement wallet history logic
    setIsOpen(false);
    router.push("/wallet/r");
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center bg-gray-800 rounded-full text-white py-1 px-3 md:py-1.5 md:px-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Wallet className="w-6 h-6 text-white" />
        <div className="ml-2">{address ? trimAddress(address) : ""}</div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={handleBuyTickets}
              className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400"
                height="200"
                viewBox="0 0 200 200"
                width="200"
              >
                <title />
                <path d="M183.25,52.75a18.22,18.22,0,0,0-7-1h-91c-3.5,0-8-.5-11.5.5a9.64,9.64,0,0,0-7.5,9.5,10,10,0,0,0,10,10h90.5l-8,42a10.22,10.22,0,0,1-10,8h-75a10.66,10.66,0,0,1-10-8l-16-74a20.3,20.3,0,0,0-19.5-16h-7a10,10,0,0,0,0,20h7l16,74c3,14,15,23.5,29.5,23.5h75c12,0,24.5-8,28-19.5,2.5-8,4-17,5.5-25,1.5-8.5,3.5-17,5-25a17.76,17.76,0,0,0,1-5,17,17,0,0,0,.5-5c0-4-2-8-5.5-9Zm-132,108.5a15,15,0,0,0,30,0h0a15,15,0,0,0-30,0Zm90,0a15,15,0,1,0,15-15,15,15,0,0,0-15,15v0Z" />
              </svg>
              Buy Tickets
            </button>
            <button
              onClick={handleWalletHistory}
              className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M21 11h-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-6a1 1 0 0 0-1-1zM5 19a1 1 0 0 1-1-1V5h12v13c0 .351.061.688.171 1H5zm15-1a1 1 0 0 1-2 0v-5h2v5z" />
                <path d="M6 7h8v2H6zm0 4h8v2H6zm5 4h3v2h-3z" />
              </svg>
              Wallet History
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400"
                height="24"
                viewBox="0 0 200 200"
                width="24"
              >
                <path d="M156.31,43.63a9.9,9.9,0,0,0-14,14,60.1,60.1,0,1,1-85,0,9.9,9.9,0,0,0-14-14c-31,31-31,82,0,113s82,31,113,0A79.37,79.37,0,0,0,156.31,43.63Zm-56.5,66.5a10,10,0,0,0,10-10v-70a10,10,0,0,0-20,0v70A10,10,0,0,0,99.81,110.13Z" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
