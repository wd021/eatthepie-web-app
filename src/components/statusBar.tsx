"use client";

import { FC, useState } from "react";
import { Close } from "@/icons";
import { Game as GameModal } from "@/components/modals";

const StatusBar: FC<{
  jackpot: number;
  isStatusBarVisible: boolean;
  setIsStatusBarVisible: (value: boolean) => void;
}> = ({ jackpot, isStatusBarVisible, setIsStatusBarVisible }) => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  return isStatusBarVisible ? (
    <>
      <div
        className="z-10 bg-[#22e523] fixed top-0 left-0 right-0 h-[70px] text-center flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setIsGameModalOpen(true)}
      >
        <div className="text-lg sm:text-2xl">
          <span>Current Jackpot:</span>
          <span className="ml-1.5 font-bold">{jackpot}ETH</span>
        </div>
        <button
          onClick={() => setIsStatusBarVisible(false)}
          className="absolute right-0 w-16 h-full flex items-center justify-center"
        >
          <Close className="w-7 h-7" />
        </button>
      </div>
      <GameModal
        isOpen={isGameModalOpen}
        onRequestClose={() => setIsGameModalOpen(false)}
      />
    </>
  ) : null;
};

export default StatusBar;
