import React from "react";
import SideMenu from "@/components/side-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#1552a7]">
      <SideMenu />
      <main className="flex-1 ml-4 mt-8"> {children}</main>
    </div>
  );
};

export default AppLayout;
