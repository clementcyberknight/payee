import {
  FiBarChart2,
  FiBriefcase,
  FiDollarSign,
  FiLock,
  FiPieChart,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

import { IBenefit } from "@/types";

export const benefits: IBenefit[] = [
  {
    title: "Efficient Payroll Management",
    description:
      "Streamline your payroll processes with our comprehensive and automated payroll management system.",
    bullets: [
      {
        title: "Automated Calculations",
        description:
          "Ensure accurate payroll calculations with minimal effort.",
        icon: <FiBarChart2 size={26} />,
      },
      {
        title: "Customizable Payroll Policies",
        description: "Adapt payroll policies to fit your business needs.",
        icon: <FiTarget size={26} />,
      },
      {
        title: "Compliance Management",
        description:
          "Stay compliant with the latest payroll regulations and standards.",
        icon: <FiTrendingUp size={26} />,
      },
    ],
    imageSrc: "/images/mockup-1.webp",
  },
  {
    title: "Comprehensive Staff Management",
    description:
      "Manage your staff efficiently with our all-in-one staff management platform.",
    bullets: [
      {
        title: "Employee Records",
        description: "Maintain detailed and organized employee records.",
        icon: <FiDollarSign size={26} />,
      },
      {
        title: "Performance Tracking",
        description: "Monitor and evaluate employee performance with ease.",
        icon: <FiBriefcase size={26} />,
      },
      {
        title: "Leave Management",
        description: "Handle leave requests and approvals seamlessly.",
        icon: <FiPieChart size={26} />,
      },
    ],
    imageSrc: "/images/mockup-2.webp",
  },
  {
    title: "Robust Security Features",
    description:
      "Protect your sensitive payroll and staff data with our advanced security measures.",
    bullets: [
      {
        title: "Data Encryption",
        description: "Secure your data with top-tier encryption protocols.",
        icon: <FiLock size={26} />,
      },
      {
        title: "Access Control",
        description: "Manage user access with role-based permissions.",
        icon: <FiUser size={26} />,
      },
      {
        title: "Fraud Detection",
        description: "Detect and prevent fraudulent activities in real-time.",
        icon: <FiShield size={26} />,
      },
    ],
    imageSrc: "/images/mockup-1.webp",
  },
];
