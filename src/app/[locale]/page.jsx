import Hero from "@/components/(hero-nav)/Hero";
import Navbar from "@/components/(hero-nav)/Navbar";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Hero");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
