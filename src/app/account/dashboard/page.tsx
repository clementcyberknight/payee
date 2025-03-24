"use client";

import type React from "react";
import {
  Calendar,
  DollarSign,
  Users,
  Search,
  CircleDollarSign,
} from "lucide-react";
import { useState, useCallback } from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import { mockTransactions, mockStats } from "@/data/dashboard/dashboardData";
import StatCard from "@/components/Dashboard/StatsCard";
import TimeDropdown from "@/components/Dashboard/TimeDropdown";
import TransactionTable from "@/components/Dashboard/TransactionTable";
import TransactionModal from "@/components/Dashboard/TransactionModal";

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
  const handleSearch = useCallback((query: string) => {
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
  }, []);

  const handleTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range);
    handleSearch(searchQuery); // Re-filter with new time range
  }, []);

  const handleShowMore = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTransaction(null);
  }, []);

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
            <TimeDropdown
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Workers in Payroll"
            value={"13"}
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
        <TransactionTable
          transactions={filteredTransactions}
          onShowMore={handleShowMore}
        />

        {/* Modal for Transaction Details */}
        {selectedTransaction && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
