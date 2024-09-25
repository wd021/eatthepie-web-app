"use client";

import { ActivityFeed, Header, StatusBar } from "@/components";
import { useState } from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);

  return (
    <div className="min-h-screen">
      <StatusBar
        jackpot={10}
        isStatusBarVisible={isStatusBarVisible}
        setIsStatusBarVisible={setIsStatusBarVisible}
      />
      <Header isStatusBarVisible={isStatusBarVisible} />
      <div
        className={`mb-[50px] ${
          isStatusBarVisible ? "mt-[145px]" : "mt-[75px]"
        }`}
      >
        {children}
      </div>
      <footer className="fixed bottom-0 flex h-[50px] w-full items-center justify-center bg-gray-100">
        <nav className="text-sm sm:text-base">
          <a href="https://github.com" target="_blank">
            Docs
          </a>
          <span className="mx-2 text-gray-400">·</span>
          <a href="https://github.com" target="_blank">
            Github
          </a>
          <span className="mx-2 text-gray-400">·</span>
          <a href="https://github.com" target="_blank">
            Mirrors
          </a>
          <span className="mx-2 text-gray-400">·</span>
          <a href="https://github.com" target="_blank">
            Responsible Gambling
          </a>
        </nav>
      </footer>
      <ActivityFeed />
    </div>
  );
};

export default Wrapper;
