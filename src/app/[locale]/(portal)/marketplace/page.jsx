"use client";
import { useTranslations } from "next-intl";

/**
 * Marketplace page - Buy and sell products/services
 * @returns {JSX.Element}
 */
export default function MarketplacePage() {
  const t = useTranslations("Sidebar");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("marketplace")}</h1>
      <p className="mt-4 text-gray-600">Marketplace page coming soon...</p>
    </div>
  );
}

