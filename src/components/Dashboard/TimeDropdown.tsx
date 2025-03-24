import React from "react";
import { ChevronDown } from "lucide-react";

interface TimeDropdownProps {
  timeRange: string;
  handleTimeRangeChange: (range: string) => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  timeRange,
  handleTimeRangeChange,
}) => {
  return (
    <div className="relative">
      <select
        className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium text-sm shadow-sm"
        value={timeRange}
        onChange={(e) => handleTimeRangeChange(e.target.value)}
      >
        <option>All time</option>
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown size={16} className="text-slate-500" />
      </div>
    </div>
  );
};

export default TimeDropdown;
