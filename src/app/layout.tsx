import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eat The Pie Lottery",
  description:
    "The world's first fully autonomous and trustless lottery built on Ethereum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
