"use client";
import { useTranslations } from "next-intl";

/**
 * Deal Room page - Business opportunities and deals
 * @returns {JSX.Element}
 */
export default function DealRoomPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("dealRoom")}</h1>
      <p className="mt-4 text-gray-600">Deal Room page coming soon...</p>
    </div>
  );
}

