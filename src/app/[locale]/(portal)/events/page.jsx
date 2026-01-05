"use client";
import { useTranslations } from "next-intl";

/**
 * Events page - Upcoming alumni events
 * @returns {JSX.Element}
 */
export default function EventsPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("events")}</h1>
      <p className="mt-4 text-gray-600">Events page coming soon...</p>
    </div>
  );
}

