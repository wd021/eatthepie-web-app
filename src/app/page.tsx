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
        <div className="max-w-[500px]">
          <div className="mb-4">The World’s First 100% Trustless Lottery</div>
          <div>
            Thanks to the power of Ethereum and Verifiable Delay Functions
            (VDF), we’ve created a fair lottery that where everyone can
            participate without relying on any centralized authority. It’s fully
            transparent, completely decentralized, and operates
            autonomously—forever. Unlike traditional lotteries that siphon off
            up to 40% in fees, our lottery charges a maximum of just 1%, capped
            at 100 ETH. Accessible worldwide, the only requirement is an
            Ethereum wallet.
          </div>
          <div className="mb-4">
            Unbreakable: Powered by Ethereum & VDF Technology
          </div>
          <div>
            Our lottery is built on Ethereum, the only system that offers 100%
            secured decentralization. Every ticket, every payout, and every
            random number is governed by a smart contract—there’s no middleman,
            no central authority, and no single point of failure. Even if
            someone tried to manipulate the system, the only potential (and
            highly improbable) attack vector would require collusion from
            validators to disrupt the randomness. That’s where Verifiable Delay
            Functions (VDFs) step in. By adding a delay to when the winning
            numbers are revealed, VDFs eliminate even this slim possibility of
            corruption. The result? Absolute fairness. Unlike traditional
            lotteries, where you have to trust the randomness of bouncing balls
            and accept hefty 40% fees, our lottery is secure by design. The
            slight delay (a couple of hours) in revealing numbers is perfect for
            a weekly lottery and ensures that no one can tamper with the
            outcome—ever. The result is a truly trustless lottery that’s
            cheaper, more transparent, and mathematically guaranteed to be fair.
            :mindblown:
          </div>
          <div className="mb-4">
            100% Open Source, Self-Executing, and Runs Forever
          </div>
          <div>
            Our lottery is designed to be as open and transparent as the
            blockchain itself. All code is open source and publicly available
            for anyone to review, audit, and verify. No hidden mechanisms, no
            behind-the-scenes tweaks—what you see is exactly what the code does.
            The game is built to run forever, and it doesn’t rely on any single
            entity to keep it going. Thanks to Ethereum’s smart contracts,
            anyone can interact with the contract to draw numbers, distribute
            prizes, or execute any part of the game’s logic. This means there’s
            no central authority, no company behind the scenes—it’s a truly
            autonomous, self-sustaining system. So, whether you’re participating
            as a player or just an interested observer, everything is in plain
            sight. This lottery is run by the community, for the
            community—forever.
          </div>
          <div>
            cavaet: only 2 things that can be changed in the smart contract..
            and why
          </div>
          <div>For a more in-depth understanding, checkout the Docs!</div>
        </div>
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
