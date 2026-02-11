"use client";

import Hero from "@/components/(hero-nav)/Hero";
import Navbar from "@/components/(hero-nav)/Navbar";
import Everything from "@/components/(hero-nav)/Everything";
import Professional from "@/components/(hero-nav)/Professional";
import BuildTogether from "@/components/(hero-nav)/BuildTogether";
import JoinToday from "@/components/(hero-nav)/JoinToday";
import { Footer } from "@/components/Footer";
import CommunityHero from "@/components/(hero-nav)/CommunityHero";
import SupportCTA from "@/components/(hero-nav)/SupportCTA";

export default function HomePage() {
  return (
    
      
      <main>
        <Hero />
        <CommunityHero/>
        <Everything />
        <Professional />
        <BuildTogether/>

        <JoinToday/>
        <SupportCTA/>
      </main>
    // </div>
  );
}
