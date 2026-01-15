"use client";

import Hero from "@/components/(hero-nav)/Hero";
import Navbar from "@/components/(hero-nav)/Navbar";
import Everything from "@/components/(hero-nav)/Everything";
import Professional from "@/components/(hero-nav)/Professional";
import BuildTogether from "@/components/(hero-nav)/BuildTogether";
import JoinToday from "@/components/(hero-nav)/JoinToday";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Everything />
        <Professional />
        <BuildTogether/>
        <JoinToday/>
      </main>
      <Footer/>
    </div>
  );
}
