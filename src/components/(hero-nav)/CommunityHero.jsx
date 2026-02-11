import { Link } from '@/i18n/routing';
import React from 'react';

const CommunitySection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#b3c7f7] to-[#1e56d3] flex flex-col items-center justify-center p-8 font-sans text-[#1a2b4b]">
      {/* Header Section */}
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Connect. <span className="text-white">Share.</span> Participate.
        </h1>
        <p className="text-lg leading-relaxed opacity-90">
          Join conversations, attend events and grow together through engaging
          discussions, community activities, and real connections.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Marketplace Card */}
        <Link href={"/marketplace"} className="bg-white rounded-2xl p-8 w-80 shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-transform hover:scale-105">
          <div className="w-12 h-12 bg-[#2d4a43] rounded-lg mb-6 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.5)]">
            <span className="text-white text-2xl">🛍️</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Marketplace</h2>
          <p className="text-gray-600 leading-snug">
            Connect, share, and grow with people in your community
          </p>
        </Link>

        {/* Events Card */}
        <Link href="/events" className="bg-white rounded-2xl p-8 w-80 shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-transform hover:scale-105">
          <div className="w-12 h-12 bg-[#2d4a43] rounded-full mb-6 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.5)]">
            <span className="text-white text-xl">$</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Events</h2>
          <p className="text-gray-600 leading-snug">
            Discover and join upcoming events.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CommunitySection;