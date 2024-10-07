"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import { WalletDropdown } from "@/components";
import { Game as GameModal, Ticket as TicketModal } from "@/components/modals";

const Header: FC<{ isStatusBarVisible: boolean }> = ({
  isStatusBarVisible,
}) => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const { isConnected } = useAccount();
  const pathname = usePathname();

  return (
    <>
      <header
        className={`z-10 bg-gray-100 h-[75px] fixed left-0 right-0 border-b border-gray-200 ${
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
              <Link
                href="/rules"
                className={
                  pathname === "/rules" ? "font-semibold underline" : ""
                }
              >
                Rules
              </Link>
              <Link
                href="/results"
                className={
                  pathname.startsWith("/results")
                    ? "font-semibold underline"
                    : ""
                }
              >
                Results
              </Link>
              {isConnected && (
                <WalletDropdown
                  purchaseTicket={() => setIsTicketModalOpen(true)}
                />
              )}
              {!isConnected && <ConnectKitButton />}
            </div>
          </div>
        </div>
      </header>
      {isGameModalOpen && (
        <GameModal onRequestClose={() => setIsGameModalOpen(false)} />
      )}
      {isTicketModalOpen && (
        <TicketModal onRequestClose={() => setIsTicketModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
