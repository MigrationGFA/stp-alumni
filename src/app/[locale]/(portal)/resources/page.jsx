"use client";
import { useTranslations } from "next-intl";

/**
 * Resources page - Educational and professional resources
 * @returns {JSX.Element}
 */
export default function ResourcesPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("resources")}</h1>
      <p className="mt-4 text-gray-600">Resources page coming soon...</p>
    </div>
  );
}

