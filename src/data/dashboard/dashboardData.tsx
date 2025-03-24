import { Stats, Transaction } from "@/types";
// data
export const mockTransactions: Transaction[] = [
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

export const mockStats: Stats = {
  workersPercentageChange: 8.3,
  nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  totalPaymentsThisMonth: 15000,
  paymentsPercentageChange: -2.5,
  payrollBalance: 25000,
};
