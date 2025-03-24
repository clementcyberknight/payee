"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  LucideProps,
  LogOutIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  path: string;
  disabled?: boolean;
  soon?: boolean; // Add soon property
}

const SideMenu = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/account/dashboard",
    },
    {
      name: "Staffing",
      icon: Users,
      path: "/account/staffing",
    },
    { name: "Payroll", icon: FileText, path: "/account/payroll" },
    {
      name: "Accounting",
      icon: BarChart3,
      path: "/account/accounting",
      disabled: true,
      soon: true,
    },
  ];

  const companyInitial = "T";
  const companyName = "Turing Finance";

  return (
    <aside
      className={`relative h-screen sticky top-0 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Company Logo */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">
              {companyInitial}
            </span>
          </div>
          <div className="overflow-hidden transition-all duration-300 w-full">
            <div className="font-semibold dark:text-white whitespace-nowrap">
              {companyName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-hidden">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  item.disabled
                    ? "cursor-not-allowed opacity-50"
                    : pathname === item.path
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                title={item.name}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
              >
                <item.icon
                  size={20}
                  className="flex-shrink-0 text-gray-500 dark:text-gray-400"
                />
                <span className="whitespace-nowrap transition-all duration-300 w-full opacity-100">
                  {item.name}
                </span>
                {item.soon && (
                  <span className="text-blue-500 text-xs ml-2">Soon</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t dark:border-gray-700 flex flex-col gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Logout"
        >
          <LogOutIcon
            size={18}
            className="flex-shrink-0 text-gray-500 dark:text-gray-400"
          />
          <span className="whitespace-nowrap transition-all duration-300 w-full opacity-100">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default SideMenu;
