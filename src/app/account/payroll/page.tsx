"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Loader2,
  Send,
  Search,
  Gift,
  CreditCard,
  ChevronDown,
  Filter,
  Download,
  Calendar,
  Edit,
  Save,
  X,
  MoreVertical,
  Trash,
  Building,
  AlertCircle,
} from "lucide-react";

// Types
interface Worker {
  id: string;
  worker_name: string;
  worker_email: string;
  bank_name: string;
  account_number: string;
  worker_salary: number;
  worker_department?: string;
  worker_position?: string;
  status?: string;
}

// Mock data
const mockWorkers: Worker[] = [
  {
    id: "w1",
    worker_name: "John Smith",
    worker_email: "john.smith@example.com",
    bank_name: "Chase Bank",
    account_number: "****5678",
    worker_salary: 2500,
    worker_department: "Engineering",
    worker_position: "Senior Developer",
    status: "active",
  },
  {
    id: "w2",
    worker_name: "Sarah Johnson",
    worker_email: "sarah.j@example.com",
    bank_name: "Bank of America",
    account_number: "****1234",
    worker_salary: 3200,
    worker_department: "Design",
    worker_position: "UI/UX Designer",
    status: "active",
  },
  {
    id: "w3",
    worker_name: "Michael Chen",
    worker_email: "m.chen@example.com",
    bank_name: "Wells Fargo",
    account_number: "****9012",
    worker_salary: 2800,
    worker_department: "Engineering",
    worker_position: "Backend Developer",
    status: "active",
  },
  {
    id: "w4",
    worker_name: "Emily Rodriguez",
    worker_email: "e.rodriguez@example.com",
    bank_name: "Citibank",
    account_number: "****3456",
    worker_salary: 4000,
    worker_department: "Management",
    worker_position: "Product Manager",
    status: "active",
  },
  {
    id: "w5",
    worker_name: "David Kim",
    worker_email: "d.kim@example.com",
    bank_name: "US Bank",
    account_number: "****7890",
    worker_salary: 2200,
    worker_department: "Marketing",
    worker_position: "Content Specialist",
    status: "invited",
  },
];

// Utility functions
const formatCurrency = (amount: number | string | undefined): string => {
  if (amount === undefined) return "N/A";

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

export default function Payroll() {
  // State variables
  const [activeTab, setActiveTab] = useState<"payroll" | "bonus">("payroll");
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSummary, setPaymentSummary] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [bonusAmounts, setBonusAmounts] = useState<Record<string, number>>({});
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<"payroll" | "bonus" | null>(
    null
  );

  // Edit worker state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    worker_name: "",
    worker_email: "",
    bank_name: "",
    account_number: "",
    worker_salary: "",
    worker_department: "",
    worker_position: "",
  });

  // Toast notification state
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Refs
  const editModalRef = useRef<HTMLDivElement>(null);

  // Calculate Payment Summary Effect
  useEffect(() => {
    if (activeTab === "payroll") {
      let sum = 0;
      selectedWorkers.forEach((workerId) => {
        const worker = workers.find((x) => x.id === workerId);
        if (worker && worker.worker_salary) {
          sum += worker.worker_salary || 0;
        }
      });
      setPaymentSummary(sum);
    } else {
      let sum = 0;
      selectedWorkers.forEach((workerId) => {
        sum += bonusAmounts[workerId] || 0;
      });
      setPaymentSummary(sum);
    }
  }, [selectedWorkers, workers, bonusAmounts, activeTab]);

  // Handle select all workers
  useEffect(() => {
    if (selectAll) {
      const filteredWorkers = workers
        .filter(
          (worker) =>
            worker.worker_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            worker.worker_email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .map((worker) => worker.id);
      setSelectedWorkers(filteredWorkers);
    } else {
      setSelectedWorkers([]);
    }
  }, [selectAll, workers, searchQuery]);

  // Close edit modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editModalRef.current &&
        !editModalRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers
  const toggleWorkerSelection = (workerId: string) => {
    setSelectedWorkers((prev) => {
      if (prev.includes(workerId)) {
        return prev.filter((id) => id !== workerId);
      } else {
        return [...prev, workerId];
      }
    });
  };

  const handleBonusAmountChange = (workerId: string, amount: string) => {
    const numericAmount = Number.parseFloat(amount);
    setBonusAmounts((prev) => ({
      ...prev,
      [workerId]: isNaN(numericAmount) ? 0 : numericAmount,
    }));
  };

  const handlePayAll = () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentType(activeTab);
      setShowSuccessModal(true);
      setSelectedWorkers([]);
      setSelectAll(false);

      if (activeTab === "bonus") {
        setBonusAmounts({});
      }
    }, 2000);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setPaymentType(null);
  };

  // Edit worker handlers
  const handleEditWorker = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setEditFormData({
      worker_name: worker.worker_name,
      worker_email: worker.worker_email,
      bank_name: worker.bank_name,
      account_number: worker.account_number,
      worker_salary: worker.worker_salary.toString(),
      worker_department: worker.worker_department || "",
      worker_position: worker.worker_position || "",
    });

    setEditingWorkerId(workerId);
    setIsEditing(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (!editingWorkerId) return;

    // Validate form data
    if (
      !editFormData.worker_name.trim() ||
      !editFormData.worker_email.trim() ||
      !editFormData.bank_name.trim() ||
      !editFormData.account_number.trim() ||
      !editFormData.worker_salary
    ) {
      showToastMessage("Please fill in all required fields", "error");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.worker_email)) {
      showToastMessage("Please enter a valid email address", "error");
      return;
    }

    // Validate salary is a number
    const salaryNum = Number.parseFloat(editFormData.worker_salary);
    if (isNaN(salaryNum)) {
      showToastMessage("Please enter a valid salary amount", "error");
      return;
    }

    // Update worker in the list
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === editingWorkerId
          ? {
              ...worker,
              worker_name: editFormData.worker_name,
              worker_email: editFormData.worker_email,
              bank_name: editFormData.bank_name,
              account_number: editFormData.account_number,
              worker_salary: salaryNum,
              worker_department: editFormData.worker_department,
              worker_position: editFormData.worker_position,
            }
          : worker
      )
    );

    // Close modal and show success message
    setIsEditing(false);
    setEditingWorkerId(null);
    showToastMessage("Worker updated successfully", "success");
  };

  const handleDeleteWorker = (workerId: string) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
      showToastMessage("Worker deleted successfully", "success");
    }
  };

  // Toast message helper
  const showToastMessage = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const anySelected = selectedWorkers.length > 0;
  const isValidBonusPayment =
    activeTab === "bonus"
      ? selectedWorkers.every(
          (id) => bonusAmounts[id] && bonusAmounts[id] > 0
        ) && anySelected
      : true;

  // Worker action menu component
  const WorkerActionMenu = ({ workerId }: { workerId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={menuRef}>
        <button
          className="p-1 rounded-full hover:bg-slate-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MoreVertical size={16} className="text-slate-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              onClick={() => {
                handleEditWorker(workerId);
                setIsOpen(false);
              }}
            >
              <Edit size={14} />
              Edit Worker
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-rose-600"
              onClick={() => {
                handleDeleteWorker(workerId);
                setIsOpen(false);
              }}
            >
              <Trash size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Toast Notification */}
        {showToast && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toastType === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500" />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Payroll</h1>
            <p className="text-slate-500 mt-1">
              Manage your team payroll and bonus payments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Calendar size={16} />
              <span>March 2023</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === "payroll"
                ? "text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("payroll")}
          >
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              <span>Regular Payroll</span>
            </div>
            {activeTab === "payroll" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === "bonus"
                ? "text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("bonus")}
          >
            <div className="flex items-center gap-2">
              <Gift size={18} />
              <span>Bonus Payments</span>
            </div>
            {activeTab === "bonus" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
            )}
          </button>
        </div>

        {/* Search and Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search workers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            {paymentSummary != null && anySelected ? (
              isProcessing ? (
                <button
                  className="bg-indigo-600 text-white rounded-lg py-2.5 px-6 flex items-center justify-center shadow-sm"
                  disabled
                >
                  <Loader2 size={18} className="mr-2 animate-spin" />{" "}
                  Processing...
                </button>
              ) : (
                <button
                  onClick={handlePayAll}
                  disabled={!anySelected || !isValidBonusPayment}
                  className={`bg-indigo-600 text-white rounded-lg py-2.5 px-6 flex items-center justify-center shadow-sm ${
                    !anySelected || !isValidBonusPayment
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-indigo-700 transition-colors"
                  }`}
                >
                  <Send size={18} className="mr-2" />
                  {activeTab === "payroll" ? "Process Payroll" : "Send Bonuses"}
                  : {formatCurrency(paymentSummary)}
                </button>
              )
            ) : (
              <button
                className="bg-white text-indigo-600 border border-indigo-200 rounded-lg py-2.5 px-6 flex items-center justify-center shadow-sm opacity-50 cursor-not-allowed"
                disabled
              >
                <Send size={18} className="mr-2" />
                {activeTab === "payroll"
                  ? "Select workers to pay"
                  : "Select workers for bonuses"}
              </button>
            )}
          </div>
        </div>

        {/* Workers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              {activeTab === "payroll" ? "Regular Payroll" : "Bonus Payments"}
            </h3>
            <span className="text-sm text-slate-500">
              {workers.length} workers
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                      checked={selectAll && workers.length > 0}
                      onChange={() => setSelectAll(!selectAll)}
                    />
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Bank Information
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {activeTab === "payroll" ? "Salary (USD)" : "Bonus Amount"}
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {workers
                  .filter(
                    (worker) =>
                      worker &&
                      (worker.worker_name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                        worker.worker_email
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        worker.worker_department
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()))
                  )
                  .map((worker) => (
                    <tr
                      key={worker.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                          checked={selectedWorkers.includes(worker.id)}
                          onChange={() => toggleWorkerSelection(worker.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-medium">
                            {worker.worker_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-800">
                              {worker.worker_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {worker.worker_position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                          {worker.worker_department || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {worker.worker_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {worker.bank_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {worker.account_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {activeTab === "payroll" ? (
                          <span className="font-medium text-slate-800">
                            {formatCurrency(worker.worker_salary)}
                          </span>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-slate-800 mr-1">$</span>
                            <input
                              type="number"
                              className={`w-24 py-1 px-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                selectedWorkers.includes(worker.id) &&
                                (!bonusAmounts[worker.id] ||
                                  bonusAmounts[worker.id] <= 0)
                                  ? "border-rose-300 bg-rose-50"
                                  : "border-slate-200"
                              }`}
                              placeholder="0.00"
                              value={bonusAmounts[worker.id] || ""}
                              onChange={(e) =>
                                handleBonusAmountChange(
                                  worker.id,
                                  e.target.value
                                )
                              }
                              disabled={!selectedWorkers.includes(worker.id)}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <WorkerActionMenu workerId={worker.id} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {workers.filter(
            (worker) =>
              worker.worker_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              worker.worker_email
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              worker.worker_department
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <div className="text-center p-10 text-slate-500">
              <div className="mb-2">
                No workers found matching your search criteria.
              </div>
              <div className="text-sm">Try adjusting your search terms.</div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-0 max-w-md w-full m-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Payment Successful
              </h3>
              <p className="text-slate-600 mb-6">
                {paymentType === "payroll"
                  ? "Payroll has been processed successfully for all selected workers."
                  : "Bonus payments have been sent successfully to all selected workers."}
              </p>
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-medium text-slate-800">
                    {formatCurrency(paymentSummary ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Workers Paid:</span>
                  <span className="font-medium text-slate-800">
                    {selectedWorkers.length}
                  </span>
                </div>
              </div>
              <button
                onClick={closeSuccessModal}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Worker Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            ref={editModalRef}
            className="bg-white rounded-xl shadow-xl p-0 max-w-2xl w-full m-4 overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800">
                Edit Worker
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="worker_name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.worker_name}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="worker_email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.worker_email}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="bank_name"
                      className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editFormData.bank_name}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Account Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="account_number"
                      className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editFormData.account_number}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Salary (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">$</span>
                    </div>
                    <input
                      type="text"
                      name="worker_salary"
                      className="w-full pl-7 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editFormData.worker_salary}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="worker_department"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.worker_department}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="worker_position"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.worker_position}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                onClick={handleSaveEdit}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
