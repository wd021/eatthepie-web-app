"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { trimAddress } from "@/utils/helpers";
import { Wallet } from "@/icons";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import { Wallet as WalletModal } from "@/components/modals";

const Header: FC<{ isStatusBarVisible: boolean }> = ({
  isStatusBarVisible,
}) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { isConnected, address } = useAccount();

  return (
    <>
      <header
        className={`bg-gray-100 h-[75px] fixed left-0 right-0 z-10 border-b border-gray-200 ${
          isStatusBarVisible ? "top-[70px]" : "top-0"
        }`}
      >
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="h-full flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/etp_logo.png"
              alt="Eat The Pie Lottery"
              className="w-[54px] h-[40px] md:w-[74px] md:h-[55px]"
            />
          </Link>
          <div className="text-lg">
            <div className="flex items-center space-x-4">
              <Link href="/rules">Rules</Link>
              <Link href="/results">Results</Link>
              {isConnected && (
                <button
                  className="flex items-center bg-gray-800 rounded-full text-white py-1 px-3 md:py-1.5 md:px-4"
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  <Wallet className="w-6 h-6 text-white" />
                  <div className="ml-2">
                    {address ? trimAddress(address) : ""}
                  </div>
                </button>
              )}
              {!isConnected && <ConnectKitButton />}
            </div>
          </div>
        </div>
      </header>
      <WalletModal
        walletAddress="0x"
        currentGameTickets={5}
        onBuyTicket={() => {}}
        isOpen={isWalletModalOpen}
        onRequestClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
};

export default Header;
