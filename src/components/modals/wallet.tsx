import { FC, useState, useEffect } from "react";
import Modal from "react-modal";
import { Close } from "@/icons";
import { useDisconnect } from "wagmi";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  walletAddress: string;
  currentGameTickets: number;
  onBuyTicket: () => void;
};

const Wallet: FC<Props> = ({
  isOpen,
  onRequestClose,
  walletAddress,
  currentGameTickets,
  onBuyTicket,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const { disconnect } = useDisconnect();

  const customStyles = {
    content: {
      overflow: "visible",
      background: "#fff",
      color: "#000",
      top: isMobile ? "0" : "50%",
      left: isMobile ? "0" : "50%",
      right: isMobile ? "0" : "auto",
      bottom: isMobile ? "0" : "auto",
      width: isMobile ? "100%" : "90%",
      maxWidth: isMobile ? "100%" : "550px",
      height: isMobile ? "100%" : "auto",
      maxHeight: "100%",
      margin: isMobile ? "0" : "auto",
      borderRadius: isMobile ? "0" : "15px",
      transform: isMobile ? "none" : "translate(-50%, -50%)",
      border: "none",
      padding: "0",
      display: "flex",
      flexDirection: "column" as const,
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 100,
    },
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 740);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className="relative flex flex-col h-full">
        <div
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
          onClick={onRequestClose}
        >
          <Close width={24} />
        </div>

        <div className="p-8 flex-grow">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Wallet</h2>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
              <p className="font-mono text-sm break-all">{walletAddress}</p>
            </div>
            <button
              onClick={() => {
                disconnect();
                onRequestClose();
              }}
              className="text-red-500 hover:text-red-600 transition-colors text-sm"
            >
              Disconnect
            </button>
          </div>

          <div className="bg-blue-100 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Current Game</h3>
            <p className="text-sm mb-4">
              You have <span className="font-bold">{currentGameTickets}</span>{" "}
              ticket(s) for the current game.
            </p>
            <button
              onClick={onBuyTicket}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors w-full"
            >
              Buy More Tickets
            </button>
          </div>
        </div>

        <div className="border-t p-4 text-center">
          <Link
            href={`/wallet/${walletAddress}`}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            View Wallet History
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default Wallet;
