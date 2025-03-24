"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  ChevronDown,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

// Transaction type definition
interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  category: "payroll" | "bonus" | "tax" | "other";
  reference: string;
  recipient?: string;
}

// Mock data for transactions
const generateMockTransactions = (): Transaction[] => {
  const categories = ["payroll", "bonus", "tax", "other"];
  const statuses = ["completed", "pending", "failed"];
  const descriptions = [
    "Monthly Payroll",
    "Quarterly Bonus",
    "Tax Payment",
    "Contractor Payment",
    "Employee Reimbursement",
    "Salary Advance",
    "Benefits Payment",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));

    const category = categories[
      Math.floor(Math.random() * categories.length)
    ] as Transaction["category"];
    const status = statuses[
      Math.floor(Math.random() * statuses.length)
    ] as Transaction["status"];
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    return {
      id: `tx-${Date.now()}-${i}`,
      date,
      description,
      amount:
        (Math.round(Math.random() * 10000) / 100) *
        (category === "tax" ? -1 : 1),
      status,
      category,
      reference: `REF-${Math.floor(Math.random() * 1000000)}`,
      recipient:
        category === "payroll" || category === "bonus"
          ? [
              "John Smith",
              "Sarah Johnson",
              "Michael Chen",
              "Emily Rodriguez",
              "David Kim",
            ][Math.floor(Math.random() * 5)]
          : undefined,
    };
  });
};

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export default function TransactionHistory() {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    Transaction["status"] | "all"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<
    Transaction["category"] | "all"
  >("all");
  const [dateRange, setDateRange] = useState<
    "7days" | "30days" | "90days" | "all"
  >("all");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const itemsPerPage = 10;

  // Initialize with mock data
  useEffect(() => {
    const mockData = generateMockTransactions();
    setTransactions(mockData);
    setFilteredTransactions(mockData);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let results = [...transactions];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (tx) =>
          tx.description.toLowerCase().includes(query) ||
          tx.reference.toLowerCase().includes(query) ||
          (tx.recipient && tx.recipient.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((tx) => tx.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      results = results.filter((tx) => tx.category === categoryFilter);
    }

    // Apply date range
    if (dateRange !== "all") {
      const now = new Date();
      const daysAgo =
        dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90;
      const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));

      results = results.filter((tx) => tx.date >= cutoffDate);
    }

    // Apply sorting
    results.sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else if (sortField === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        const aValue = String(a[sortField]).toLowerCase();
        const bValue = String(b[sortField]).toLowerCase();
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    setFilteredTransactions(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    transactions,
    searchQuery,
    statusFilter,
    categoryFilter,
    dateRange,
    sortField,
    sortDirection,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort toggle
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Handle transaction details view
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
    let bgColor, textColor, icon;

    switch (status) {
      case "completed":
        bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
        textColor = "text-emerald-700 dark:text-emerald-400";
        icon = <CheckCircle size={14} className="mr-1" />;
        break;
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-950/30";
        textColor = "text-amber-700 dark:text-amber-400";
        icon = <Clock size={14} className="mr-1" />;
        break;
      case "failed":
        bgColor = "bg-rose-50 dark:bg-rose-950/30";
        textColor = "text-rose-700 dark:text-rose-400";
        icon = <XCircle size={14} className="mr-1" />;
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Category badge component
  const CategoryBadge = ({
    category,
  }: {
    category: Transaction["category"];
  }) => {
    let bgColor, textColor;

    switch (category) {
      case "payroll":
        bgColor = "bg-indigo-50 dark:bg-indigo-950/30";
        textColor = "text-indigo-700 dark:text-indigo-400";
        break;
      case "bonus":
        bgColor = "bg-purple-50 dark:bg-purple-950/30";
        textColor = "text-purple-700 dark:text-purple-400";
        break;
      case "tax":
        bgColor = "bg-slate-50 dark:bg-slate-800";
        textColor = "text-slate-700 dark:text-slate-400";
        break;
      case "other":
        bgColor = "bg-blue-50 dark:bg-blue-950/30";
        textColor = "text-blue-700 dark:text-blue-400";
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Transaction History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage your transaction history
          </p>
        </div>

        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80 h-10 px-4 py-2 w-full md:w-auto">
          <Download size={16} className="mr-2" />
          Export Transactions
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            className="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 appearance-none"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as Transaction["status"] | "all")
            }
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            className="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 appearance-none"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value as Transaction["category"] | "all"
              )
            }
          >
            <option value="all">All Categories</option>
            <option value="payroll">Payroll</option>
            <option value="bonus">Bonus</option>
            <option value="tax">Tax</option>
            <option value="other">Other</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {/* Date Range */}
        <div className="relative">
          <Calendar
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            className="w-full pl-9 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 appearance-none"
            value={dateRange}
            onChange={(e) =>
              setDateRange(
                e.target.value as "7days" | "30days" | "90days" | "all"
              )
            }
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    <ArrowUpDown
                      size={14}
                      className={`ml-1 transition-transform ${
                        sortField === "date" ? "opacity-100" : "opacity-40"
                      } ${
                        sortField === "date" && sortDirection === "asc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("description")}
                  >
                    Description
                    <ArrowUpDown
                      size={14}
                      className={`ml-1 transition-transform ${
                        sortField === "description"
                          ? "opacity-100"
                          : "opacity-40"
                      } ${
                        sortField === "description" && sortDirection === "asc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    <ArrowUpDown
                      size={14}
                      className={`ml-1 transition-transform ${
                        sortField === "amount" ? "opacity-100" : "opacity-40"
                      } ${
                        sortField === "amount" && sortDirection === "asc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 dark:text-slate-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-300">
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      {transaction.recipient && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Recipient: {transaction.recipient}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <CategoryBadge category={transaction.category} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <span
                        className={
                          transaction.amount >= 0
                            ? "text-slate-900 dark:text-slate-300"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      <button
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                        onClick={() => handleViewDetails(transaction)}
                      >
                        View
                        <ExternalLink size={14} className="ml-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={24} className="mb-2 text-slate-400" />
                      <p>No transactions found</p>
                      <p className="text-xs mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredTransactions.length}</span>{" "}
              results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-8 w-8 p-0"
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-8 w-8 p-0"
              >
                <span className="sr-only">Next page</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                Transaction Details
              </h3>
              <button
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                onClick={() => setSelectedTransaction(null)}
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Date
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(selectedTransaction.date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Description
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {selectedTransaction.description}
                </span>
              </div>
              {selectedTransaction.recipient && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Recipient
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {selectedTransaction.recipient}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Category
                </span>
                <CategoryBadge category={selectedTransaction.category} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Amount
                </span>
                <span
                  className={`text-sm font-medium ${
                    selectedTransaction.amount >= 0
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {formatCurrency(selectedTransaction.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Status
                </span>
                <StatusBadge status={selectedTransaction.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Reference
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {selectedTransaction.reference}
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <button
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                onClick={() => setSelectedTransaction(null)}
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
