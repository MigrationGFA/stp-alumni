"use client";
import { useTranslations } from "next-intl";
import { Construction } from "lucide-react";

/**
 * @param {string} pageName 
 * @returns {JSX.Element}
 */
export default function ComingSoon({ pageName }) {
  const t = useTranslations("ComingSoon");
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-[#00D3F2] to-[#155DFC] p-4">
            <Construction className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {pageName}
        </h1>
        <p className="text-lg text-[#DDEBFF] mb-2">
          {t("message")}
        </p>
        <p className="text-sm text-[#90A1B9]">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
