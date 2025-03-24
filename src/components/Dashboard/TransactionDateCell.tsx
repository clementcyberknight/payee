import React from "react";

interface TransactionDateCellProps {
  timestamp: { seconds: number } | undefined;
}
const TransactionDateCell: React.FC<TransactionDateCellProps> = ({
  timestamp,
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

export default TransactionDateCell;
