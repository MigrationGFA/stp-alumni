"use client";
import ComingSoon from "@/components/ComingSoon";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Navbar");
  
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#233389_0%,#162456_50%,#233389_100%)] dark:bg-[linear-gradient(135deg,#233389_0%,#162456_50%,#233389_100%)]">
      <ComingSoon pageName={t("contact")} />
    </div>
  );
}
