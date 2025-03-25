"use client";
import React, { useState } from "react";
import {
  Download,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";

interface Transaction {
  name: string;
  walletAddress: string;
  transactionType: string;
  date: string;
  amount: string;
}

const transactions: Transaction[] = [
  {
    name: "Elijah Ulaitor",
    walletAddress: "8058387906",
    transactionType: "Withdrawal",
    date: "Mar 19, 2025 4:37PM",
    amount: "₦5000.00",
  },
  {
    name: "Taiwo Farinu",
    walletAddress: "8067910399",
    transactionType: "Wallet Funding",
    date: "Mar 18, 2025 11:30AM",
    amount: "₦1000.00",
  },
  {
    name: "Taiwo Farinu",
    walletAddress: "8067910399",
    transactionType: "Wallet Funding",
    date: "Mar 18, 2025 8:37AM",
    amount: "₦5000.00",
  },
  {
    name: "Elijah Ulaitor",
    walletAddress: "8058387906",
    transactionType: "Withdrawal",
    date: "Mar 05, 2025 8:02AM",
    amount: "₦50000.00",
  },
  {
    name: "Elijah Ulaitor",
    walletAddress: "8058387906",
    transactionType: "Withdrawal",
    date: "Mar 05, 2025 8:00AM",
    amount: "₦10000.00",
  },
  {
    name: "Elijah Ulaitor",
    walletAddress: "8058387906",
    transactionType: "Withdrawal",
    date: "Mar 05, 2025 7:58AM",
    amount: "₦60000.00",
  },
  {
    name: "Elijah Ulaitor",
    walletAddress: "8058387906",
    transactionType: "Wallet Funding",
    date: "Feb 22, 2025 3:47PM",
    amount: "₦2000.00",
  },
];

const TransactionsPage: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  const openTransactionModal = () => setIsTransactionModalOpen(true);
  const closeTransactionModal = () => setIsTransactionModalOpen(false);

  return (
    <div className="relative rounded-tl-xl  min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-tl-xl shadow-md p-6 w-full">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Transactions</h2>
        </div>
        <div className="flex justify-between items-start mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search table..."
              className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={openTransactionModal}
              className="bg-[#1552a7] rounded-md text-white font-semibold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              Wallet
            </button>
            <button
              onClick={openWalletModal}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline flex items-center gap-2 shadow-sm"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction.name}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction.walletAddress}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction.transactionType}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm text-center">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
