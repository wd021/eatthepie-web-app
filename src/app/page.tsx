"use client";

import { useRef, useState } from "react";
import { Countdown } from "@/components";
import { Game, Purchase } from "@/components/modals";
import { useLotteryInfo } from "@/hooks";

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => {
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
          isOpen ? "pb-6" : "max-h-0"
        }`}
      >
        <div className="text-gray-600 text-lg leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default function Home() {
  const [modal, setModal] = useState<boolean | "purchase" | "game">(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { lotteryInfo } = useLotteryInfo();

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
                {lotteryInfo?.prizePool}Ξ
              </div>
              <div className="text-lg lg:text-3xl text-black font-semibold mt-2">
                <Countdown secondsUntilDraw={lotteryInfo?.secondsUntilDraw} />
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
            <Section icon="🌎" title="A Trustless and Fair World Lottery">
              <div>
                Imagine a global lottery where everyone plays on equal footing,
                free from manipulation or unfair advantages. Thanks to the power
                of{" "}
                <a
                  href="https://www.ethereum.org"
                  target="_blank"
                  className="underline font-semibold"
                >
                  Ethereum
                </a>{" "}
                and{" "}
                <a
                  href="https://www.youtube.com/watch?v=_-feyaZZjEw"
                  target="_blank"
                  className="underline font-semibold"
                >
                  Verifiable Delay Functions (VDFs)
                </a>
                , we now have that: a decentralized, self-executing lottery that
                operates autonomously forever. No hidden tricks, no human
                involvement—just pure, verifiable randomness.
              </div>
              <div className="pt-4">
                Traditional lotteries take up to <b>50% in fees</b>, leaving a
                fraction of the pool for the winners. Our lottery takes only{" "}
                <b>1% in fees</b>, capped at 100 ETH. That means more of the
                prize money goes back to where it belongs—into the hands of the
                participants. It&apos;s a global game, accessible to anyone with
                an{" "}
                <a
                  href="https://ethereum.org/en/wallets/"
                  target="_blank"
                  className="underline font-semibold"
                >
                  Ethereum wallet
                </a>
                .
              </div>
            </Section>

            <Section icon="🔒" title="Unbreakable: Ethereum & VDFs">
              <div>
                The lottery runs on the Ethereum blockchain, a decentralized
                network powered by thousands of validators around the world.
                This robust infrastructure not only secures cryptocurrencies but
                also serves as the foundation for our lottery’s integrity.
              </div>
              <div className="pt-4">
                We took it a step further by incorporating Verifiable Delay
                Functions (VDFs) into the process of generating random lottery
                numbers. VDFs introduce a required time delay, ensuring that
                even if validators tried to collude, they wouldn’t be able to
                predict or manipulate the outcome.
              </div>
              <div className="pt-4">
                This combination makes the lottery tamper proof — mathematically
                guaranteed, autonomous, and resistant to manipulation.
              </div>
            </Section>

            <Section
              icon="💻"
              title="Open Source, Self-Executing, and Runs Forever"
            >
              <div>
                All{" "}
                <a
                  href="https://www.github.com"
                  target="_blank"
                  className="underline font-semibold"
                >
                  code is open
                </a>{" "}
                and publicly available for anyone to review, audit, and verify.
              </div>
              <div className="pt-4">
                Want to dive deeper into how the lottery works?{" "}
                <a
                  href="https://docs.eatthepie.xyz"
                  target="_blank"
                  className="underline font-semibold"
                >
                  Explore our docs
                </a>{" "}
                for a detailed breakdown.
              </div>
              <div className="pt-4">
                We’ve also taken decentralization a step further by hosting this{" "}
                <a
                  href="https://www.ipfs.com"
                  target="_blank"
                  className="underline font-semibold"
                >
                  website on IPFS
                </a>
                . You can also access it via <b>eatthepie.eth</b> on browsers
                that support IPFS (brave).
              </div>
            </Section>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              For a more in-depth understanding, check out the documentation!
            </p>
            <a
              href="https://docs.eatthepie.xyz"
              target="_blank"
              className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold"
            >
              Read the Docs
            </a>
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
