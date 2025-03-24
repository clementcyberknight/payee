import React from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils";
import TransactionDateCell from "./TransactionDateCell";
import { ExternalLink } from "lucide-react";
import TransactionStatus from "@/components/Dashboard/TransactionStatus";

interface TransactionTableProps {
  transactions: Transaction[];
  onShowMore: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onShowMore,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Recent Transactions
        </h3>
        <span className="text-sm text-slate-500 font-medium">
          {transactions.length} transactions
        </span>
      </div>
      <div className="overflow-x-auto">
        {transactions.length > 0 ? (
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
              {transactions
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
                      <TransactionDateCell timestamp={transaction.timestamp} />
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
                      <TransactionStatus status={transaction.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onShowMore(transaction)}
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
  );
};

export default TransactionTable;
