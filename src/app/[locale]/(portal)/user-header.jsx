"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  MessageSquareMore,
  Bell,
  PanelTopOpen,
  ChevronDown,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileDrawer } from "@/components/ProfileDrawer";

function UserHeader({toggleSidebar, isCollapsed}) {
  const [isScrolled, setIsScrolled] = useState(false);

  const data = {
    email: "dev@stp-alumni.com",
    name: "Emannuel",
    img: "/assets/Profile Image.jpg",
  };

  useEffect(() => {
    const handleScroll = () => {
      // If we've scrolled more than 10px, trigger the glass effect
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`sticky top-0 z-30 w-full px-6 md:px-8 py-4 transition-all duration-300 flex  items-center  justify-between ${
        isScrolled
          ? "bg-[#E8ECF4]/60 backdrop-blur-md border-b border-white/20 shadow-sm"
          : "bg-[#E8ECF4] border-b border-transparent"
      }`}
    >
      {/* Logo - click goes to landing page */}
      <Link href="/" className="flex lg:hidden items-center justify-center gap-3 6 md:py-6 border-b border-white/10">
        <Image
          src="/assets/Blazing-Torrent-Color-logo.png"
          alt="STP Alumni"
          width={140}
          height={40}
          className="object-contain h-10 w-auto"
          priority
        />
      </Link>

      <button
        onClick={toggleSidebar}
        className="hidden lg:flex p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 "
      >
        {isCollapsed ? (
          <PanelLeftOpen size={20} />
        ) : (
          <PanelLeftClose size={20} />
        )}
      </button>

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          {/* Message Button */}
          <button className="hidden md:block p-3 rounded-full transition-all bg-[#02061814] hover:bg-white/60 active:scale-95 shadow-sm ">
            <MessageSquareMore className="h-6 w-6 text-[#020618]" />
          </button>

          {/* Notification Button */}
          <button className="p-3 rounded-full transition-all bg-[#02061814] hover:bg-white/60 active:scale-95 shadow-sm ">
            <Bell className="h-4 w-4 md:h-6 md:w-6 text-[#020618]" />
          </button>

          {/* Mobile: ProfileDrawer trigger */}
          <ProfileDrawer data={data}>
            <button className="lg:hidden flex items-center gap-2 cursor-pointer">
              <Avatar className="h-10 w-10 border-2 border-accent ">
                <AvatarImage src={data?.img} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  EM
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:block">
                <h1 className="text-[#020618] font-semibold">
                  {data?.name || "User"}
                </h1>
                <p className="text-[#02061873] font-light text-sm">
                  {data?.email || "No email"}
                </p>
              </div>
            </button>
          </ProfileDrawer>

          {/* Profile Wrapper */}
          <div className=" gap-1 items-center hidden lg:flex">
            <Avatar className="h-10 w-10 border-2 border-accent">
              <AvatarImage src={data?.img} />

              {/* Get a fallback avatar in form of an initials here */}
              <AvatarFallback className="bg-primary text-primary-foreground">
                EM
              </AvatarFallback>
            </Avatar>
            {/* 
            <div className="relative h-10 w-10 rounded-full bg-white/50 overflow-hidden  shadow-sm">
              <Image
                src={|| "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}
                alt="Profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div> */}

            <div className="hidden sm:block">
              <h1 className="text-[#020618] font-semibold">
                {data?.name || "User"}
              </h1>
              <p className="text-[#02061873] font-light text-sm">
                {data?.email || "No email"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
