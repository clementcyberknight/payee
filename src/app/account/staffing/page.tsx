"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Filter,
  ChevronDown,
  Plus,
  Search,
  MoreVertical,
  Check,
  UploadCloud,
  Edit,
  Trash,
  Download,
  Building,
  CreditCard,
  Save,
  AlertCircle,
} from "lucide-react";

// Types
interface Worker {
  id: string;
  name: string;
  email: string;
  role: string;
  salary: number;
  status: "active" | "invited" | "inactive";
  bankName: string;
  accountNumber: string;
  department?: string;
  position?: string;
  note?: string;
  joinDate?: string;
}

// Mock data
const mockWorkers: Worker[] = [
  {
    id: "w1",
    name: "John Smith",
    email: "john.smith@example.com",
    bankName: "Chase Bank",
    accountNumber: "****5678",
    salary: 2500,
    role: "Developer",
    department: "Engineering",
    position: "Senior Developer",
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: "w2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    bankName: "Bank of America",
    accountNumber: "****1234",
    salary: 3200,
    role: "Designer",
    department: "Design",
    position: "UI/UX Designer",
    status: "active",
    joinDate: "2023-02-20",
  },
  {
    id: "w3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    bankName: "Wells Fargo",
    accountNumber: "****9012",
    salary: 2800,
    role: "Developer",
    department: "Engineering",
    position: "Backend Developer",
    status: "active",
    joinDate: "2023-03-10",
  },
  {
    id: "w4",
    name: "Emily Rodriguez",
    email: "e.rodriguez@example.com",
    bankName: "Citibank",
    accountNumber: "****3456",
    salary: 4000,
    role: "Manager",
    department: "Management",
    position: "Product Manager",
    status: "active",
    joinDate: "2022-11-05",
  },
  {
    id: "w5",
    name: "David Kim",
    email: "d.kim@example.com",
    bankName: "US Bank",
    accountNumber: "****7890",
    salary: 2200,
    role: "Marketing",
    department: "Marketing",
    position: "Content Specialist",
    status: "invited",
    joinDate: "2023-04-15",
  },
];

// Worker roles
const WORKER_ROLES = [
  "Developer",
  "Designer",
  "Manager",
  "Admin",
  "Marketing",
  "Support",
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

export default function Staffing() {
  // State variables
  const [activeTab, setActiveTab] = useState<
    "WORKER LIST" | "INVITE WORKER" | "BULK WORKER INVITE"
  >("WORKER LIST");
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(mockWorkers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [isEditingWorker, setIsEditingWorker] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    salary: "",
    bankName: "",
    accountNumber: "",
    note: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter workers based on search query and role filter
  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const results = workers.filter(
      (worker) =>
        (worker.name?.toLowerCase().includes(lowerSearch) ||
          worker.email?.toLowerCase().includes(lowerSearch) ||
          worker.role?.toLowerCase().includes(lowerSearch) ||
          worker.bankName?.toLowerCase().includes(lowerSearch) ||
          formatCurrency(worker.salary).includes(lowerSearch)) &&
        (selectedRoleFilter === "All" || worker.role === selectedRoleFilter)
    );
    setFilteredWorkers(results);
  }, [searchQuery, workers, selectedRoleFilter]);

  // Toast functions
  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType("success");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType("error");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new worker
  const handleAddWorker = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.role ||
      !formData.salary ||
      !formData.bankName.trim() ||
      !formData.accountNumber.trim()
    ) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    const salaryNum = Number.parseFloat(
      formData.salary.replace(/[^0-9.-]+/g, "")
    );
    if (isNaN(salaryNum)) {
      showErrorToast("Please enter a valid salary amount.");
      return;
    }

    setIsAddingWorker(true);

    // Simulate API call
    setTimeout(() => {
      const newWorker: Worker = {
        id: `w${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        salary: salaryNum,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        note: formData.note,
        status: "invited",
        joinDate: new Date().toISOString().split("T")[0],
      };

      setWorkers((prev) => [...prev, newWorker]);
      setFormData({
        name: "",
        email: "",
        role: "",
        salary: "",
        bankName: "",
        accountNumber: "",
        note: "",
      });
      setActiveTab("WORKER LIST");
      showSuccessToast("Worker added successfully!");
      setIsAddingWorker(false);
    }, 1000);
  };

  // Handle editing a worker
  const handleEditWorker = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setFormData({
      name: worker.name,
      email: worker.email,
      role: worker.role,
      salary: worker.salary.toString(),
      bankName: worker.bankName,
      accountNumber: worker.accountNumber,
      note: worker.note || "",
    });

    setEditingWorkerId(workerId);
    setIsEditingWorker(true);
  };

  // Handle saving edited worker
  const handleSaveEdit = () => {
    if (!editingWorkerId) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.role ||
      !formData.salary ||
      !formData.bankName.trim() ||
      !formData.accountNumber.trim()
    ) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    const salaryNum = Number.parseFloat(
      formData.salary.replace(/[^0-9.-]+/g, "")
    );
    if (isNaN(salaryNum)) {
      showErrorToast("Please enter a valid salary amount.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setWorkers((prev) =>
        prev.map((worker) =>
          worker.id === editingWorkerId
            ? {
                ...worker,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                salary: salaryNum,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                note: formData.note,
              }
            : worker
        )
      );

      setFormData({
        name: "",
        email: "",
        role: "",
        salary: "",
        bankName: "",
        accountNumber: "",
        note: "",
      });

      setEditingWorkerId(null);
      setIsEditingWorker(false);
      showSuccessToast("Worker updated successfully!");
    }, 1000);
  };

  // Handle deleting a worker
  const handleDeleteWorker = (workerId: string) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      // Simulate API call
      setTimeout(() => {
        setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
        showSuccessToast("Worker deleted successfully!");
      }, 500);
    }
  };

  // Handle file upload for bulk import
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }

    if (file.type !== "text/csv") {
      setUploadError("Please upload a valid CSV file.");
      return;
    }

    setUploadedFileName(file.name);
    setUploadError("");

    // Simulate CSV parsing and processing
    setIsBulkUploading(true);
    setTimeout(() => {
      // Simulate adding 3 new workers
      const newWorkers: Worker[] = [
        {
          id: `w${Date.now()}1`,
          name: "Alex Thompson",
          email: "alex.t@example.com",
          role: "Developer",
          salary: 2700,
          bankName: "TD Bank",
          accountNumber: "****4321",
          status: "invited",
          joinDate: new Date().toISOString().split("T")[0],
        },
        {
          id: `w${Date.now()}2`,
          name: "Jessica Lee",
          email: "j.lee@example.com",
          role: "Designer",
          salary: 2900,
          bankName: "Capital One",
          accountNumber: "****8765",
          status: "invited",
          joinDate: new Date().toISOString().split("T")[0],
        },
        {
          id: `w${Date.now()}3`,
          name: "Ryan Martinez",
          email: "r.martinez@example.com",
          role: "Marketing",
          salary: 2400,
          bankName: "PNC Bank",
          accountNumber: "****2109",
          status: "invited",
          joinDate: new Date().toISOString().split("T")[0],
        },
      ];

      setWorkers((prev) => [...prev, ...newWorkers]);
      setIsBulkUploading(false);
      setActiveTab("WORKER LIST");
      showSuccessToast("Bulk worker upload successful!");
    }, 2000);
  };

  // Handle clearing the file input
  const handleClearFile = () => {
    setUploadedFileName("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle exporting worker list
  const handleExportList = () => {
    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      showSuccessToast("Worker list exported successfully!");
    }, 1000);
  };

  // Filter dropdown component
  const FilterDropdown = ({
    options,
    selected,
    onSelect,
  }: {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
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
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter size={16} className="text-slate-500" />
          <span className="text-slate-700">{selected}</span>
          <ChevronDown size={16} className="text-slate-500" />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
            {options.map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700"
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
            <div
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 flex items-center gap-2"
              onClick={() => {
                handleEditWorker(workerId);
                setIsOpen(false);
              }}
            >
              <Edit size={16} />
              Edit Worker
            </div>
            <div
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-rose-600 flex items-center gap-2"
              onClick={() => {
                handleDeleteWorker(workerId);
                setIsOpen(false);
              }}
            >
              <Trash size={16} />
              Delete Worker
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast notification */}
        {showToast && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toastType === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {toastType === "success" ? (
              <Check className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500" />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Staffing</h1>
            <p className="text-slate-500 mt-1">
              Manage your team members and their payment information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              onClick={handleExportList}
              disabled={isExporting}
            >
              <Download size={16} />
              {isExporting ? "Exporting..." : "Export List"}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              onClick={() => setActiveTab("INVITE WORKER")}
            >
              <Plus size={16} />
              Add Worker
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex gap-8">
            {[
              { id: "WORKER LIST", label: "Worker List" },
              { id: "INVITE WORKER", label: "Add Worker" },
              { id: "BULK WORKER INVITE", label: "Bulk Import" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`pb-3 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => {
                  setActiveTab(
                    tab.id as
                      | "WORKER LIST"
                      | "INVITE WORKER"
                      | "BULK WORKER INVITE"
                  );
                  if (tab.id === "INVITE_WORKER") {
                    setIsEditingWorker(false);
                    setEditingWorkerId(null);
                    setFormData({
                      name: "",
                      email: "",
                      role: "",
                      salary: "",
                      bankName: "",
                      accountNumber: "",
                      note: "",
                    });
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Worker List Tab */}
        {activeTab === "WORKER LIST" && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <FilterDropdown
                options={["All", ...WORKER_ROLES]}
                selected={selectedRoleFilter}
                onSelect={setSelectedRoleFilter}
              />
              <div className="relative w-full md:w-auto md:min-w-[320px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 shadow-sm"
                  placeholder="Search workers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  Workers
                </h3>
                <span className="text-sm text-slate-500">
                  {filteredWorkers.length} workers
                </span>
              </div>

              {filteredWorkers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Bank Information
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Salary
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredWorkers.map((worker) => (
                        <tr
                          key={worker.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-9 w-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-medium">
                                {worker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-slate-800">
                                  {worker.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {worker.position || worker.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {worker.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                              {worker.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-800">
                              {worker.bankName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {worker.accountNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                            {formatCurrency(worker.salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                worker.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : worker.status === "invited"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {worker.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <WorkerActionMenu workerId={worker.id} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-10 text-slate-500">
                  <div className="mb-2">
                    No workers found matching your criteria.
                  </div>
                  <div className="text-sm">
                    Try adjusting your search or filter settings.
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add/Edit Worker Tab */}
        {activeTab === "INVITE WORKER" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {isEditingWorker ? "Edit Worker" : "Add New Worker"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role *
                </label>
                <select
                  name="role"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select role</option>
                  {WORKER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Salary (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500">$</span>
                  </div>
                  <input
                    type="text"
                    name="salary"
                    className="w-full pl-7 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bank Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="bankName"
                    className="w-full pl-10 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="accountNumber"
                    className="w-full pl-10 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                name="note"
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Add any additional information about this worker"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => {
                  setActiveTab("WORKER LIST");
                  setIsEditingWorker(false);
                  setEditingWorkerId(null);
                  setFormData({
                    name: "",
                    email: "",
                    role: "",
                    salary: "",
                    bankName: "",
                    accountNumber: "",
                    note: "",
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                onClick={isEditingWorker ? handleSaveEdit : handleAddWorker}
                disabled={isAddingWorker}
              >
                {isEditingWorker ? (
                  <>
                    <Save size={16} />
                    {isAddingWorker ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {isAddingWorker ? "Adding..." : "Add Worker"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Bulk Import Tab */}
        {activeTab === "BULK WORKER INVITE" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Bulk Import Workers
            </h2>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-indigo-700">
                    Upload a CSV file with worker details. The file should
                    include columns for name, email, role, salary, bank name,
                    and account number.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload CSV File
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <div
                  className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors ${
                    uploadedFileName ? "border-indigo-500" : "border-slate-300"
                  }`}
                >
                  <UploadCloud
                    size={48}
                    className={
                      uploadedFileName ? "text-indigo-500" : "text-slate-400"
                    }
                  />
                  {uploadedFileName ? (
                    <>
                      <p className="text-sm font-medium text-slate-700">
                        Uploaded: {uploadedFileName}
                      </p>
                      <button
                        onClick={handleClearFile}
                        className="text-rose-600 hover:text-rose-700 text-sm"
                      >
                        Clear
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Click to upload or drag and drop a CSV file
                    </p>
                  )}
                </div>
                {uploadError && (
                  <p className="text-sm text-rose-600 mt-2">{uploadError}</p>
                )}
              </div>

              {isBulkUploading && (
                <div className="text-center p-4 text-slate-500 mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <span>Uploading workers... Please wait.</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setActiveTab("WORKER LIST")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
