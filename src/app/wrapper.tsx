"use client";

import { ActivityFeed, Header, StatusBar } from "@/components";
import { Ethereum } from "@/icons";
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
        className={`mb-[100px] ${
          isStatusBarVisible ? "mt-[145px]" : "mt-[75px]"
        }`}
      >
        {children}
      </div>
      <footer className="fixed bottom-0 flex flex-col h-[100px] w-full items-center justify-center bg-gray-100 border-t border-gray-200">
        <div className="h-[50px] flex items-center justify-center underline font-semibold cursor-pointer">
          <Ethereum className="w-5 h-5 mr-1" />
          <div>Ethereum Mainet: 0x3u218436218563210</div>
        </div>
        <nav className="h-[50px] text-sm sm:text-base">
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
