import React from "react";

interface TransactionStatusProps {
  status: "Success" | "Failed" | "Pending";
}
const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case "Success":
        return "bg-emerald-50 text-emerald-700";
      case "Failed":
        return "bg-rose-50 text-rose-700";
      case "Pending":
        return "bg-amber-50 text-amber-700";
      default:
        return ""; // Default case, should never happen with your type
    }
  };

  return (
    <span
      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses()}`}
    >
      {status}
    </span>
  );
};

export default TransactionStatus;
