"use client";
import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import UserHeader from "../user-header";
import OnboardingGuard from "@/components/shared/OnboardingGuard";
import PasswordChangeBanner from "@/components/shared/PasswordChangeBanner";

export default function PortalLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <OnboardingGuard>
      <div className="flex min-h-screen bg-[#E8ECF4]">
        <Sidebar isCollapsed={isCollapsed} />

        <main 
          className={`relative flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-60"
          } ml-0`}
        >
          <UserHeader toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
          <PasswordChangeBanner />
        
          <div className="flex-1 sm:p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </OnboardingGuard>
  );
}