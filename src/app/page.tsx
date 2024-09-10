import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4 text-center px-6">
      <Image
        src="/logo.png"
        alt="Eat The Pie Lottery"
        width={300}
        height={300}
      />
      <div className="text-2xl">
        The world&apos;s first fully autonomous and trustless lottery built on
        Ethereum.
      </div>
      <div className="text-2xl">Coming soon...</div>
    </div>
  );
}
