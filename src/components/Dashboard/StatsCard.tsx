import React from "react";
import { formatCurrency } from "@/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  percentageChange?: number;
  icon: React.ElementType;
  isPositiveChange?: boolean;
  dateString?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentageChange,
  icon: Icon,
  isPositiveChange,
  dateString,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-slate-50 p-2 rounded-lg">
            <Icon className="w-5 h-5 text-slate-700" />
          </div>
          <span className="text-sm font-medium text-slate-600">{title}</span>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-bold text-slate-800">
          {typeof value === "number" ? formatCurrency(value) : value}
        </div>
        {percentageChange !== undefined && (
          <div
            className={`text-sm font-medium flex items-center mt-1 ${
              isPositiveChange ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingDown size={14} className="mr-1" />
            )}
            {Math.abs(percentageChange)}%{" "}
            {isPositiveChange ? "increase" : "decrease"}
          </div>
        )}
        {dateString && (
          <div className="text-sm text-indigo-600 mt-1 font-medium">
            {dateString}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
