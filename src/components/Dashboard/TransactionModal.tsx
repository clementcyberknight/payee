import React from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils";
import { X } from "lucide-react";
import TransactionStatus from "@/components/Dashboard/TransactionStatus";

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-0 max-w-md w-full m-4 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-slate-800">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1 rounded-full hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="border-b border-gray-100 pb-4">
            <p className="text-sm text-slate-500 mb-1">Transaction Date</p>
            <p className="text-base font-medium text-slate-800">
              {transaction.timestamp?.seconds
                ? new Date(transaction.timestamp.seconds * 1000).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "No Date"}
            </p>
          </div>
          {/* ... (rest of the modal content) ... */}
          <div className="border-b border-gray-100 pb-4">
            <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
            <p className="text-base font-medium text-slate-800">
              {transaction.transactionid || "N/A"}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4">
            <p className="text-sm text-slate-500 mb-1">Amount</p>
            <p className="text-base font-medium text-slate-800">
              {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4">
            <p className="text-sm text-slate-500 mb-1">Category</p>
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
          </div>
          <div className="border-b border-gray-100 pb-4">
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <TransactionStatus status={transaction.status} />
          </div>
          {transaction.transactionHash && (
            <div className="pb-2">
              <p className="text-sm text-slate-500 mb-1">Transaction Hash</p>
              <p className="text-xs font-mono break-all bg-slate-50 p-3 rounded-lg text-slate-700 border border-slate-100">
                {transaction.transactionHash}
              </p>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-gray-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
