"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Settings,
  HelpCircle,
  LucideProps,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  path: string;
  disabled?: boolean;
  soon?: boolean;
}

const SideMenu = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Debug: Log state changes
  useEffect(() => {
    console.log("Sidebar collapsed state:", collapsed);
  }, [collapsed]);

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
    {
      name: "Payroll",
      icon: FileText,
      path: "/account/payroll",
    },
    {
      name: "Accounting",
      icon: BarChart3,
      path: "/account/accounting",
      disabled: true,
      soon: true,
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/account/settings",
    },
    {
      name: "Help & Support",
      icon: HelpCircle,
      path: "/account/support",
    },
  ];

  // Group menu items
  const mainMenuItems = menuItems.slice(0, 4);
  const secondaryMenuItems = menuItems.slice(4);

  const companyInitial = "T";
  const companyName = "Turing Finance";

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={`relative h-screen sticky top-0 ${
        collapsed ? "w-20" : "w-72"
      } bg-slate-50 dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Company Logo */}
      <div className="p-5 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-xl">
              {companyInitial}
            </span>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-full opacity-100"
            }`}
          >
            <div className="font-semibold text-gray-800 dark:text-white whitespace-nowrap">
              {companyName}
            </div>
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon size={18} />
          ) : (
            <ChevronLeftIcon size={18} />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <nav>
          <div className={`px-4 mb-2 ${collapsed ? "sr-only" : ""}`}>
            <p className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider">
              Main Menu
            </p>
          </div>
          <ul className="space-y-1 px-3">
            {mainMenuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.disabled ? "#" : item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    item.disabled
                      ? "cursor-not-allowed opacity-60"
                      : pathname === item.path
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 hover:bg-slate-200/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                  }`}
                  title={item.name}
                  onClick={
                    item.disabled ? (e) => e.preventDefault() : undefined
                  }
                >
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 ${
                      pathname === item.path
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">
                      {item.name}
                    </span>
                  )}
                  {item.soon && !collapsed && (
                    <span className="text-xs font-medium ml-auto py-0.5 px-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary Navigation */}
          <div className={`px-4 mt-8 mb-2 ${collapsed ? "sr-only" : ""}`}>
            <p className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider">
              Support
            </p>
          </div>
          <ul className="space-y-1 px-3">
            {secondaryMenuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    pathname === item.path
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 hover:bg-slate-200/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                  }`}
                  title={item.name}
                >
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 ${
                      pathname === item.path
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-slate-200/50 dark:hover:bg-gray-800/50 transition-all"
          title="Logout"
        >
          <LogOutIcon
            size={20}
            className="flex-shrink-0 text-gray-500 dark:text-gray-400"
          />
          {!collapsed && (
            <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">
              Logout
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default SideMenu;
