"use client";

import type React from "react";

import {
  Calendar,
  DollarSign,
  Users,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

// Types
interface Transaction {
  id: string;
  timestamp: {
    seconds: number;
  };
  transactionid?: string;
  transactionHash?: string;
  amount: number;
  category: "Payroll" | "Bonus" | "Other";
  status: "Success" | "Failed" | "Pending";
  workerName?: string;
  workerId?: string;
  type?: string;
  date?: {
    seconds: number;
  };
}

interface Stats {
  workersInPayroll: number;
  workersPercentageChange: number;
  nextPaymentDate: Date | null;
  totalPaymentsThisMonth: number;
  paymentsPercentageChange: number;
  payrollBalance: number;
}

// Utility functions
const formatCurrency = (amount: number | string): string => {
  const numericAmount =
    typeof amount === "number"
      ? amount
      : Number.parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericAmount)) {
    return "Invalid Amount";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
};

const formatDate = (timestamp: { seconds: number } | undefined): string => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(timestamp.seconds * 1000);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    timestamp: { seconds: Date.now() / 1000 - 3600 },
    transactionid: "TX-001-2023",
    transactionHash:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    amount: 1250.0,
    category: "Payroll",
    status: "Success",
  },
  {
    id: "tx2",
    timestamp: { seconds: Date.now() / 1000 - 86400 },
    transactionid: "TX-002-2023",
    transactionHash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    amount: 500.0,
    category: "Bonus",
    status: "Success",
  },
  {
    id: "tx3",
    timestamp: { seconds: Date.now() / 1000 - 172800 },
    transactionid: "TX-003-2023",
    transactionHash:
      "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    amount: 1250.0,
    category: "Payroll",
    status: "Failed",
  },
  {
    id: "tx4",
    timestamp: { seconds: Date.now() / 1000 - 259200 },
    transactionid: "TX-004-2023",
    transactionHash:
      "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    amount: 1250.0,
    category: "Payroll",
    status: "Pending",
  },
  {
    id: "tx5",
    timestamp: { seconds: Date.now() / 1000 - 345600 },
    transactionid: "TX-005-2023",
    transactionHash:
      "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    amount: 750.0,
    category: "Bonus",
    status: "Success",
  },
];

const mockStats: Stats = {
  workersInPayroll: 12,
  workersPercentageChange: 8.3,
  nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  totalPaymentsThisMonth: 15000,
  paymentsPercentageChange: -2.5,
  payrollBalance: 25000,
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [timeRange, setTimeRange] = useState("All time");
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(mockTransactions);

  // Format the next payment date display
  const nextPaymentDateDisplay = mockStats.nextPaymentDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(mockStats.nextPaymentDate)
    : "No scheduled payroll";

  // Calculate days from now for next payment
  const daysFromNow = mockStats.nextPaymentDate
    ? (() => {
        const today = new Date();
        const diffTime = mockStats.nextPaymentDate!.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} days from now` : "Today";
      })()
    : "";

  // Filter transactions based on search query and time range
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = [...mockTransactions];
    const today = new Date();

    if (timeRange !== "All time") {
      const rangeDays: { [key: string]: number } = {
        "Last 7 days": 7,
        "Last 30 days": 30,
        "Last 90 days": 90,
      };

      const selectedRangeDays = rangeDays[timeRange] || 0;

      filtered = mockTransactions.filter((transaction) => {
        const transactionDate = transaction.timestamp
          ? new Date(transaction.timestamp.seconds * 1000)
          : null;
        if (!transactionDate) return false;
        const diffTime = Math.abs(today.getTime() - transactionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= selectedRangeDays;
      });
    }

    const lowerSearch = query.toLowerCase();
    filtered = filtered.filter(
      (transaction) =>
        (transaction.workerName &&
          transaction.workerName.toLowerCase().includes(lowerSearch)) ||
        (transaction.transactionid &&
          transaction.transactionid.toLowerCase().includes(lowerSearch)) ||
        (transaction.workerId &&
          transaction.workerId.toLowerCase().includes(lowerSearch)) ||
        (transaction.type &&
          transaction.type.toLowerCase().includes(lowerSearch)) ||
        (transaction.amount &&
          formatCurrency(transaction.amount)
            .toLowerCase()
            .includes(lowerSearch)) ||
        (transaction.timestamp &&
          formatDate(transaction.timestamp).toLowerCase().includes(lowerSearch))
    );

    setFilteredTransactions(filtered);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    handleSearch(searchQuery); // Re-filter with new time range
  };

  const handleShowMore = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  // Component for stat cards
  const StatCard = ({
    title,
    value,
    percentageChange,
    icon: Icon,
    isPositiveChange,
    dateString,
  }: {
    title: string;
    value: string | number;
    percentageChange?: number;
    icon: React.ElementType;
    isPositiveChange?: boolean;
    dateString?: string;
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

  // Component for time range dropdown
  const TimeRangeDropdown = () => (
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

  // Component for transaction date cell
  const TransactionDateCell = ({
    timestamp,
  }: {
    timestamp: { seconds: number } | undefined;
  }) => {
    if (!timestamp) return <div>No Date</div>;

    const date = new Date(timestamp.seconds * 1000);

    return (
      <div>
        <div className="font-medium text-slate-800">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="text-xs text-slate-500">
          {date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Payroll Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back. Here's your payroll activity overview.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 text-slate-700 shadow-sm"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <TimeRangeDropdown />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Workers in Payroll"
            value={mockStats.workersInPayroll}
            percentageChange={mockStats.workersPercentageChange}
            icon={Users}
            isPositiveChange={true}
          />
          <StatCard
            title="Next Payment Date"
            value={nextPaymentDateDisplay}
            dateString={daysFromNow}
            icon={Calendar}
          />
          <StatCard
            title="Total Payments (This Month)"
            value={formatCurrency(mockStats.totalPaymentsThisMonth)}
            percentageChange={mockStats.paymentsPercentageChange}
            icon={DollarSign}
            isPositiveChange={false}
          />
          <StatCard
            title="Total Payroll Paid"
            value={formatCurrency(mockStats.payrollBalance)}
            icon={CircleDollarSign}
          />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Transactions
            </h3>
            <span className="text-sm text-slate-500 font-medium">
              {filteredTransactions.length} transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            {filteredTransactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Amount (USDC)
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTransactions
                    .sort((a, b) => {
                      // Sort by timestamp in descending order (newest first)
                      const dateA = a.timestamp?.seconds || 0;
                      const dateB = b.timestamp?.seconds || 0;
                      return dateB - dateA;
                    })
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <TransactionDateCell
                            timestamp={transaction.timestamp}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="font-medium text-slate-800">
                            {transaction.transactionid || "N/A"}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">
                            {transaction.transactionHash ? (
                              <span title={transaction.transactionHash}>
                                {`${transaction.transactionHash.substring(
                                  0,
                                  6
                                )}...${transaction.transactionHash.substring(
                                  transaction.transactionHash.length - 4
                                )}`}
                              </span>
                            ) : (
                              "No Hash"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              transaction.category === "Payroll"
                                ? "bg-indigo-50 text-indigo-700"
                                : transaction.category === "Bonus"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              transaction.status === "Success"
                                ? "bg-emerald-50 text-emerald-700"
                                : transaction.status === "Failed"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleShowMore(transaction)}
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none transition-colors duration-200 font-medium flex items-center gap-1"
                          >
                            View Details
                            <ExternalLink size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center p-10 text-slate-500">
                <div className="mb-2">
                  No transactions found matching your criteria.
                </div>
                <div className="text-sm">
                  Try adjusting your search or time range filters.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Transaction Details */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-0 max-w-md w-full m-4 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-slate-800">
                Transaction Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-slate-500 mb-1">Transaction Date</p>
                <p className="text-base font-medium text-slate-800">
                  {selectedTransaction.timestamp?.seconds
                    ? new Date(
                        selectedTransaction.timestamp.seconds * 1000
                      ).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "No Date"}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
                <p className="text-base font-medium text-slate-800">
                  {selectedTransaction.transactionid || "N/A"}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-slate-500 mb-1">Amount</p>
                <p className="text-base font-medium text-slate-800">
                  {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-slate-500 mb-1">Category</p>
                <span
                  className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${
                    selectedTransaction.category === "Payroll"
                      ? "bg-indigo-50 text-indigo-700"
                      : selectedTransaction.category === "Bonus"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-purple-50 text-purple-700"
                  }`}
                >
                  {selectedTransaction.category}
                </span>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <span
                  className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${
                    selectedTransaction.status === "Success"
                      ? "bg-emerald-50 text-emerald-700"
                      : selectedTransaction.status === "Failed"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedTransaction.status}
                </span>
              </div>
              {selectedTransaction.transactionHash && (
                <div className="pb-2">
                  <p className="text-sm text-slate-500 mb-1">
                    Transaction Hash
                  </p>
                  <p className="text-xs font-mono break-all bg-slate-50 p-3 rounded-lg text-slate-700 border border-slate-100">
                    {selectedTransaction.transactionHash}
                  </p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 bg-slate-50">
              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
