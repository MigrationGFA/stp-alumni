"use client";
import { useTranslations } from "next-intl";

/**
 * Settings page - User preferences and account settings
 * @returns {JSX.Element}
 */
export default function SettingsPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("settings")}</h1>
      <p className="mt-4 text-gray-600">Settings page coming soon...</p>
    </div>
  );
}

