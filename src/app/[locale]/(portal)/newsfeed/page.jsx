"use client";
import { useTranslations } from "next-intl";

/**
 * Newsfeed page - Latest updates and posts
 * @returns {JSX.Element}
 */
export default function NewsfeedPage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("newsfeed")}</h1>
      <p className="mt-4 text-gray-600">Newsfeed page coming soon...</p>
    </div>
  );
}

