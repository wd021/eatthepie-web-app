import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import Wrapper from "./wrapper";

export const metadata: Metadata = {
  title: "Eat The Pie - The Wrold Lottery",
  description:
    "The world's first fully autonomous and trustless lottery running on Ethereum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Web3Provider>
        <body>
          <Wrapper>{children}</Wrapper>
        </body>
      </Web3Provider>
    </html>
  );
}
