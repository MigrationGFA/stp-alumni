"use client";
import { useTranslations } from "next-intl";

/**
 * Network page - Alumni network and connections
 * @returns {JSX.Element}
 */
export default function NetworkPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("network")}</h1>
      <p className="mt-4 text-gray-600">Network page coming soon...</p>
    </div>
  );
}

