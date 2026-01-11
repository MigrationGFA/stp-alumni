"use client";
import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import UserHeader from "./user-header";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function PortalLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#E8ECF4]">
      {/* Pass state to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Dynamic margin based on collapse state */}
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-60"
        } ml-0`}
      >
        {/* Pass toggle function to Header */}
        <UserHeader toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
      
        <div className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}