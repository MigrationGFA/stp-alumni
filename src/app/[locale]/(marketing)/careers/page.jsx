"use client";
import Navbar from "@/components/(hero-nav)/Navbar";
import { Footer } from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { useTranslations } from "next-intl";

export default function CareersPage() {
  const t = useTranslations("Footer");
  
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#233389_0%,#162456_50%,#233389_100%)] dark:bg-[linear-gradient(135deg,#233389_0%,#162456_50%,#233389_100%)]">
      <Navbar />
      <ComingSoon pageName={t("company.careers")} />
      <Footer />
    </div>
  );
}
