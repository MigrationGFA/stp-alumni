"use client";
import { useTranslations } from "next-intl";

/**
 * Messaging page - Direct messages and conversations
 * @returns {JSX.Element}
 */
export default function MessagingPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("messaging")}</h1>
      <p className="mt-4 text-gray-600">Messaging page coming soon...</p>
    </div>
  );
}

