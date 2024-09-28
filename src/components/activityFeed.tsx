"use client";

import { Activity, Ticket } from "@/icons";
import React, { useState, useEffect } from "react";

// Helper function to generate a random Ethereum address
const generateRandomAddress = () => {
  return (
    "0x" +
    Array(40)
      .fill(0)
      .map(() => Math.random().toString(16)[2])
      .join("")
  );
};

// Helper function to generate a random time in the last 24 hours
const generateRandomTime = () => {
  const now = new Date();
  const pastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return new Date(
    pastDay.getTime() + Math.random() * (now.getTime() - pastDay.getTime())
  );
};

// Generate dummy activities
const generateDummyActivities = (count: number) => {
  return Array(count)
    .fill(null)
    .map(() => ({
      address: generateRandomAddress(),
      action: Math.random() > 0.3 ? "purchased" : "won",
      amount: Math.floor(Math.random() * 10) + 1,
      timestamp: generateRandomTime(),
    }));
};

interface Activity {
  address: string;
  action: string;
  amount: number;
  timestamp: Date;
}

const ActivityFeed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(generateDummyActivities(20));
  }, []);

  // Function to format the time difference
  const formatTimeDifference = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - timestamp.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gray-900 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isOpen ? "rotate-45" : ""
        } w-16 h-16 flex items-center justify-center`}
      >
        <Ticket className="w-8 h-8" />
      </button>
      <div
        className={`fixed right-2 bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen
            ? "bottom-[90px] h-[calc(100vh-105px)] opacity-100"
            : "bottom-[90px] h-0 opacity-0"
        }`}
        style={{ width: "350px" }}
      >
        <div className="p-4 h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Latest Purchases</h3>
          <ul className="space-y-2 overflow-y-auto flex-grow hide-scrollbar">
            {activities.map((activity, index) => (
              <li key={index} className="text-sm border-b border-gray-200 pb-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-800">
                    {activity.address.slice(0, 6)}...
                    {activity.address.slice(-4)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeDifference(activity.timestamp)}
                  </span>
                </div>
                <p className="text-gray-600">
                  {activity.action === "purchased" ? (
                    <>
                      Purchased{" "}
                      <span className="font-semibold">{activity.amount}</span>{" "}
                      ticket{activity.amount > 1 ? "s" : ""}
                    </>
                  ) : (
                    <>
                      Won{" "}
                      <span className="font-semibold">
                        {activity.amount} ETH
                      </span>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
