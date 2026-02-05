"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Sidebar from "@/components/shared/Sidebar";
import UserHeader from "./user-header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import PublicPortalLayout from "./PublicPortalLayout";
import { AuthViewProvider } from "@/contexts/AuthViewContext";
import { useIsRegistered } from "@/hooks/useIsRegistered";

const PUBLIC_PATHS = ["/events", "/marketplace"];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function PortalLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isRegistered, mounted } = useIsRegistered();
  const t = useTranslations("Sidebar");

  const showPublicLayout =
    mounted && isPublicPath(pathname) && !isRegistered;

  if (showPublicLayout) {
    const pageTitle = pathname.includes("marketplace") ? t("marketplace") : t("events");
    return (
      <AuthViewProvider isPublicView={true}>
        <PublicPortalLayout pageTitle={pageTitle}>
          <div className="min-h-0 w-full">
            {children}
          </div>
        </PublicPortalLayout>
      </AuthViewProvider>
    );
  }

  return (
    <AuthViewProvider isPublicView={false}>
      <div className="flex min-h-screen bg-[#E8ECF4]">
        <Sidebar isCollapsed={isCollapsed} />

        <main
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-60"
          } ml-0`}
        >
          <UserHeader toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />

          <div className="flex-1 sm:p-4 lg:p-6 overflow-auto pb-20 lg:pb-6">
            {children}
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </AuthViewProvider>
  );
}