import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <Image
        src="/logo.png"
        alt="Eat The Pie Lottery"
        width={300}
        height={300}
      />
      <div className="text-2xl mt-12">
        A fully autonomous and trustless world lottery running on Ethereum.
      </div>
      <div className="text-2xl mt-4">Coming soon...</div>
    </div>
  );
}
