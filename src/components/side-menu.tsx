import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Wallet,
  ListChecks,
  ShieldAlert,
  Fingerprint,
  FileText,
  MessageSquare,
  LogOut,
} from "lucide-react";

interface SideMenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({
  icon,
  label,
  active,
  onClick,
}) => {
  return (
    <li
      className={`flex items-center gap-4 p-4  rounded-lg cursor-pointer text-sm ${
        active
          ? "bg-white text-[#1552a7]"
          : "hover:bg-blue-500/20 text-gray-300"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </li>
  );
};

const SideMenu: React.FC = () => {
  return (
    <aside className="bg-[#1552a7] text-white w-54 min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-4  flex">
          <img
            src="/images/neupay.webp"
            alt="Neupay Logo"
            className="h-14 w-auto"
          />
        </div>
        <nav>
          <ul className="space-y-1 ml-2">
            <SideMenuItem
              icon={<LayoutDashboard size={20} />}
              label="Overview"
            />
            <SideMenuItem icon={<Users size={20} />} label="Users" />
            <SideMenuItem icon={<UserCog size={20} />} label="Admin" />
            <SideMenuItem
              icon={<Wallet size={20} />}
              label="Transactions"
              active={true}
            />
            <SideMenuItem
              icon={<ListChecks size={20} />}
              label="Charge Rules"
            />
            <SideMenuItem icon={<ShieldAlert size={20} />} label="Dispute" />
            <SideMenuItem icon={<Fingerprint size={20} />} label="KYC" />
            <SideMenuItem icon={<FileText size={20} />} label="T&C" />
            <SideMenuItem icon={<MessageSquare size={20} />} label="FAQs" />
            <SideMenuItem icon={<LogOut size={20} />} label="Logout" />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;
