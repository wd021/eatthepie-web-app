import { Activity } from "@/icons";
import React, { useState } from "react";

const ActivityFeed = ({ activities = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white shadow-xl text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isOpen ? "rotate-45" : ""
        } w-16 h-16`}
      >
        <Activity />
      </button>
      <div
        className={`absolute bottom-20 right-0 bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? "w-64 h-96 opacity-100" : "w-0 h-0 opacity-0"
        }`}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Activity</h3>
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <li key={index} className="text-sm">
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
