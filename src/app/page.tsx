import { Wallet } from "@/icons";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="h-screen min-h-[850px] flex flex-col items-center justify-center border-b border-gray-300">
        {/* header */}
        <div className="w-full flex items-center p-4 justify-between border-b border-gray-300">
          <Image
            src="/logo.png"
            alt="Eat The Pie Lottery"
            width={75}
            height={75}
          />
          <div className="flex items-center gap-x-6 text-xl">
            <div>Rules</div>
            <div>Game Rounds</div>
            <div className="flex items-center bg-gray-200 px-5 rounded-full">
              <Wallet width="30px" />
              <div className="ml-2">Connect</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-full w-full max-w-container px-4 gap-x-8">
          <div className="ml-4 flex flex-col max-w-[560px]">
            <div className="text-8xl font-bold mb-8">The World Lottery</div>
            <div className="text-4xl ml-2 mb-12 text-gray-500 gap-y-4 flex flex-col">
              <div>Fully transparent and fair</div>
              <div>Self-executing</div>
              <div>Secured by Ethereum</div>
            </div>
            <div className="flex gap-x-6">
              <button className="bg-blue-600 w-[250px] h-[75px] flex items-center justify-center rounded-full text-white font-semibold text-xl hover:bg-blue-800">
                Buy Ticket (0.01ETH)
              </button>
              <button className="border border-gray-400 w-[250px] h-[75px] flex items-center justify-center rounded-full text-xl">
                How It Works
              </button>
            </div>
          </div>
          <div className="relative text-white w-[460px] aspect-[2/3] shrink-0">
            <img
              src="/jackpot.png"
              className="shrink-0 w-full h-full"
              alt="Jackpot"
            />
            <div className="absolute w-full h-[50%] top-[50%] flex flex-col items-center justify-center">
              {/* <div className="text-2xl text-black font-semibold">
                Current Jackpot
              </div> */}
              <div className="text-7xl my-2 font-bold text-black">10 ETH</div>
              <div className="text-4xl text-black font-semibold">42:50:20</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen min-h-[850px] bg-blue-50 flex items-center justify-center">
        Explain how it works
      </div>
    </>
  );
}
