"use client";
import { useState } from "react";
import { Game, Purchase } from "@/components/modals";

export default function Home() {
  const [modal, setModal] = useState<boolean | "purchase" | "game">(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b border-gray-300">
        <div
          className={`flex flex-col lg:flex-row items-center justify-center h-full w-full max-w-container py-10 lg:py-16 px-4 gap-x-12`}
        >
          <div className="text-center lg:text-left lg:ml-4 flex flex-col lg:max-w-[560px]">
            <div className="text-4xl lg:text-7xl font-bold mb-2 sm:mb-4 lg:mb-10">
              The World Lottery
            </div>
            <div className="text-xl ml-2 mb-6 lg:mb-12 text-gray-500 lg:gap-y-2 flex flex-col">
              <div>Fully transparent and fair</div>
              <div>Self-executing</div>
              <div>Secured by Ethereum</div>
            </div>
            <div className="flex gap-x-6 hidden lg:flex">
              <button
                className="bg-gray-800 w-[260px] h-[75px] flex items-center justify-center rounded-full text-white font-semibold text-xl"
                onClick={() => setModal("purchase")}
              >
                Buy Ticket - 0.1ETH
              </button>
              <button className="border border-gray-400 w-[260px] h-[75px] flex items-center justify-center rounded-full text-xl font-semibold">
                How It Works
              </button>
            </div>
          </div>
          <div
            className="relative text-white w-[240px] lg:w-[420px] aspect-[2/3] shrink-0 cursor-pointer"
            onClick={() => setModal("game")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jackpot_green.png"
              className="shrink-0 w-full h-full"
              alt="Jackpot"
            />
            <div className="absolute w-full h-[50%] top-[50%] flex flex-col items-center justify-center">
              <div className="text-4xl lg:text-7xl font-bold text-black">
                10Ξ
              </div>
              <div className="text-lg lg:text-4xl text-black font-semibold">
                42:50:20
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 flex mt-4 lg:hidden">
            <button
              className="bg-gray-800 w-[260px] h-[75px] flex items-center justify-center rounded-full text-white font-semibold text-xl"
              onClick={() => setModal("purchase")}
            >
              Buy Ticket - 0.1ETH
            </button>
            <button className="border border-gray-400 w-[260px] h-[75px] flex items-center justify-center rounded-full text-xl font-semibold">
              How It Works
            </button>
          </div>
        </div>
      </div>
      <div className="py-[400px] bg-blue-50 flex items-center justify-center flex flex-col">
        <div>Explain how it works</div>
      </div>
      {modal === "purchase" && (
        <Purchase isOpen={true} onRequestClose={() => setModal(false)} />
      )}
      {modal === "game" && (
        <Game isOpen={true} onRequestClose={() => setModal(false)} />
      )}
    </>
  );
}
