"use client";
import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import UserHeader from "../user-header";
import OnboardingGuard from "@/components/shared/OnboardingGuard";
import PasswordChangeBanner from "@/components/shared/PasswordChangeBanner";
import { usePathname } from "@/i18n/routing";

export default function PortalLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pathname = usePathname()
  const isMessaging = pathname.includes("messaging")
  // console.log(isMessaging,"pathname")

  return (
    <OnboardingGuard>
      <div className="flex min-h-screen bg-[#E8ECF4]">
        <Sidebar isCollapsed={isCollapsed} />

        <main 
          className={`relative flex-1 flex flex-col ${isMessaging ? "pb-20 md:pb-0":"pb-20"} transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-60"
          } ml-0`}
        >
          <UserHeader toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
          <PasswordChangeBanner />
        
        <div className="flex-1 sm:p-4 lg:p-6">
            {children}
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </OnboardingGuard>
  );
}