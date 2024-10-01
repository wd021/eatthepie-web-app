"use client";
import { useRef, useState } from "react";
import { Game, Purchase } from "@/components/modals";
import { useLotteryInfo } from "@/hooks";
interface SectionProps {
  icon: string;
  title: string;
  content: string;
}

export default function Home() {
  const [modal, setModal] = useState<boolean | "purchase" | "game">(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { lotteryInfo } = useLotteryInfo();

  console.log("lotteryInfo", lotteryInfo);

  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      const yOffset = -100;
      const y =
        howItWorksRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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
            <div className="text-2xl ml-2 mb-6 lg:mb-12 text-gray-500 lg:gap-y-2 flex flex-col">
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
              <button
                className="border border-gray-400 w-[260px] h-[75px] flex items-center justify-center rounded-full text-xl font-semibold"
                onClick={scrollToHowItWorks}
              >
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
            <button
              className="border border-gray-400 w-[260px] h-[75px] flex items-center justify-center rounded-full text-xl font-semibold"
              onClick={scrollToHowItWorks}
            >
              How It Works
            </button>
          </div>
        </div>
      </div>

      <div
        ref={howItWorksRef}
        className="py-16 bg-gradient-to-b from-green-50 to-white"
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

          <div className="space-y-6">
            <Section
              icon="🌎"
              title="A Trustless and Fair World Lottery"
              content="Thanks to the power of Ethereum and Verifiable Delay Functions (VDF), we've created a fair lottery where everyone can participate without relying on any centralized authority. It's fully transparent, completely decentralized, and operates autonomously—forever. Unlike traditional lotteries that siphon off up to 40% in fees, our lottery charges a maximum of just 1%, capped at 100 ETH. Accessible worldwide, the only requirement is an Ethereum wallet."
            />

            <Section
              icon="🔒"
              title="Unbreakable: Ethereum & VDFs"
              content="Our lottery is built on Ethereum, the only system that offers 100% secured decentralization. Every ticket, every payout, and every random number is governed by a smart contract—there's no middleman, no central authority, and no single point of failure. Verifiable Delay Functions (VDFs) add a delay to when the winning numbers are revealed, eliminating even the slim possibility of corruption. The result is a truly trustless lottery that's cheaper, more transparent, and mathematically guaranteed to be fair."
            />

            <Section
              icon="💻"
              title="Open Source, Self-Executing, and Runs Forever"
              content="Our lottery is designed to be as open and transparent as the blockchain itself. All code is open source and publicly available for anyone to review, audit, and verify. The game is built to run forever, and it doesn't rely on any single entity to keep it going. Thanks to Ethereum's smart contracts, anyone can interact with the contract to draw numbers, distribute prizes, or execute any part of the game's logic. This means there's no central authority, no company behind the scenes—it's a truly autonomous, self-sustaining system."
            />
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              For a more in-depth understanding, check out our documentation!
            </p>
            <button className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold">
              Read the Docs
            </button>
          </div>
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

const Section: React.FC<SectionProps> = ({ icon, title, content }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
      <div
        className="p-6 flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-4 text-2xl">{icon}</div>
        <h3 className="text-xl font-semibold flex-grow">{title}</h3>
        <span
          className={`text-xl transform transition-transform duration-300 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>
      <div
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 text-lg">{content}</p>
      </div>
    </div>
  );
};
