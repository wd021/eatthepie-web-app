import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <Image
        src="/logo.png"
        alt="Eat The Pie Lottery"
        width={250}
        height={250}
      />
      <div className="text-4xl mt-4 mb-2 max-w-[520px]">
        The world lottery on Ethereum.
        <br />
        Global, transparent, and fair.
      </div>
      <div className="text-lg mb-10 font-semibold text-gray-500">
        100% automated, 100% random, 1% fee
      </div>
      <div className="mb-12">
        <div className="text-8xl font-bold">5,000ETH</div>
        <div className="text-lg text-gray-500">CURRENT JACKPOT</div>
      </div>
      <div className="flex gap-x-8">
        <div className="bg-blue-500 w-[250px] h-[60px] flex items-center justify-center rounded-full text-white font-semibold text-xl">
          Buy Ticket (0.01ETH)
        </div>
        <div className="border border-gray-400 w-[250px] h-[60px] flex items-center justify-center rounded-full text-xl">
          Learn More
        </div>
      </div>
    </div>
  );
}
