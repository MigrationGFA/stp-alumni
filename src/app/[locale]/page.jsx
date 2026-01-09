import Hero from "@/components/(hero-nav)/Hero";
import Navbar from "@/components/(hero-nav)/Navbar";
import Everything from "@/components/(hero-nav)/Everything";
import { useTranslations } from "next-intl";
import Professional from "@/components/(hero-nav)/Professional";
import BuildTogether from "@/components/(hero-nav)/BuildTogether";

export default function HomePage() {
  const t = useTranslations("Hero");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Everything />
        <Professional />
        <BuildTogether/>
      </main>
    </div>
  );
}
