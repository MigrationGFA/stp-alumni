"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { 
  MessageCircle, 
  Bell, 
  MoreHorizontal,
  MoreVertical,
  Plus,
  Image as ImageIcon,
  Video,
  Heart,
  MessageSquare,
  UserPlus,
  Calendar,
  ShoppingBag,
  ChevronRight,
  Globe,
  Send,
  Bookmark,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dashboard page - main landing page after login
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [postContent, setPostContent] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((postId) => {
        const ref = dropdownRefs.current[postId];
        if (ref && !ref.contains(event.target)) {
          setOpenDropdown(null);
        }
      });
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (postId) => {
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  // Sample data for demonstration
  const networkContacts = [
    { name: "Bayu Saito", email: "john@lstp.org", image: "/assets/Profile Image.jpg" },
    { name: "Bayu Saito", email: "sarah@lstp.org", image: "/assets/Profile Image.jpg" },
    { name: "Bayu Saito", email: "mike@lstp.org", image: "/assets/Profile Image.jpg" },
  ];

  const invitations = [
    { name: "Bayu Saito", messageKey: "invitedYou", image: "/assets/Profile Image.jpg" },
    { name: "Bayu Saito", messageKey: "invitedYou", image: "/assets/Profile Image.jpg" },
    { name: "Bayu Saito", messageKey: "invitedYou", image: "/assets/Profile Image.jpg" },
    { name: "Bayu Saito", messageKey: "invitedYou", image: "/assets/Profile Image.jpg" },
  ];

  const messages = [
    { name: "Bayu Saito", messageKey: "message1", date: "Aug 9", image: "/assets/Profile Image.jpg" },
    { name: "Oreoluwa Sade", messageKey: "message2", date: "Aug 9", image: "/assets/Profile Image.jpg" },
    { name: "James Bond", messageKey: "message3", date: "Aug 9", image: "/assets/Profile Image.jpg" },
    { name: "Bisola Aduwa", messageKey: "message4", date: "Aug 9", image: "/assets/Profile Image.jpg" },
  ];

  return (
    <div className="min-h-screen bg-[#E8ECF4]">
      {/* Header */}
      <header className="px-52 py-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full transition-colors bg-[rgba(2,6,24,0.08)] hover:bg-[rgba(2,6,24,0.12)]">
              <MessageCircle className="h-6 w-6 text-stp-blue-light" />
            </button>
            <button className="p-3 rounded-full transition-colors bg-[rgba(2,6,24,0.08)] hover:bg-[rgba(2,6,24,0.12)]">
              <Bell className="h-6 w-6 text-stp-blue-light" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
              <Image
                src="/assets/Profile Image.jpg"
                alt="Profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-52 py-6">
        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold text-stp-blue-light mb-6">{t("title")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* E-Learning Course Banner */}
            <div className="rounded-xl overflow-hidden p-8 text-white" style={{ background: 'linear-gradient(132.7deg, #ED202D -39.31%, #233389 71.64%, #FBAD17 159.79%)' }}>
              <p className="text-sm font-medium mb-3">E-LEARNING COURSE</p>
              <h2 className="text-3xl font-bold mb-4">
                {t("courseTitle")}
              </h2>
              <Button className="bg-[#ED202D] hover:bg-[#d01824] text-white rounded-full px-4 flex items-center gap-2">
                {t("joinNow")}
                <span className="bg-white rounded-full p-1">
                  <ChevronRight className="h-4 w-4 text-black" />
                </span>
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <button className="flex-1 flex flex-row items-center justify-start gap-2 py-4">
                <div className="p-2 rounded-lg bg-[rgba(237,32,45,0.08)]">
                  <Globe className="h-5 w-5 text-[#ED202D]" />
                </div>
                <span className="text-sm font-medium text-gray-900">{t("networking")}</span>
              </button>
              <button className="flex-1 flex flex-row items-center justify-start gap-2 py-4">
                <div className="p-2 rounded-lg bg-[rgba(54,124,255,0.08)]">
                  <Calendar className="h-5 w-5 text-[#367CFF]" />
                </div>
                <span className="text-sm font-medium text-gray-900">{t("events")}</span>
              </button>
              <button className="flex-1 flex flex-row items-center justify-start gap-2 py-4">
                <div className="p-2 rounded-lg bg-[rgba(251,173,23,0.08)]">
                  <ShoppingBag className="h-5 w-5 text-[#FBAD17]" />
                </div>
                <span className="text-sm font-medium text-gray-900">{t("marketplace")}</span>
              </button>
            </div>

            {/* Post Creation */}
            <div className="rounded-lg p-4 border border-[#233389]">
              <div>
                <textarea
                  placeholder={t("startPost")}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-3 border-0 rounded-lg resize-none focus:outline-none focus:border focus:border-[#233389] bg-transparent"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(0,0,0,0.3)]">
                  <div className="flex gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <Button 
                    className={`text-white rounded-lg px-6 flex items-center gap-2 ${
                      postContent.trim() 
                        ? "bg-[#233389] hover:bg-[#1d2a6e]" 
                        : "bg-[#23338966] hover:bg-[#23338980]"
                    }`}
                  >
                    {t("submitPost")}
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* News Feed Post */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                    <Image
                      src="/assets/Profile Image.jpg"
                      alt={t("postAuthorName")}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#233389]">{t("postAuthorName")}</h3>
                    <p className="text-sm text-gray-600">{t("postAuthorTitle")}</p>
                    <p className="text-xs text-gray-500">Today, 7:00PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <Button variant="outline" size="sm" className="text-[#233389] border-[#233389] hover:bg-[#233389] hover:text-white">
                    <Plus className="h-4 w-4 mr-1" />
                    {t("follow")}
                  </Button>
                  <div className="relative" ref={(el) => (dropdownRefs.current['post1'] = el)}>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => toggleDropdown('post1')}
                    >
                      <MoreHorizontal className="h-5 w-5 text-[#233389]" />
                    </button>
                    {openDropdown === 'post1' && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left">
                          <Bookmark className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{t("save")}</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left rounded-b-lg">
                          <LinkIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{t("copyLink")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                {t("postContent")} <span className="text-[#2B7FFF] cursor-pointer hover:underline">{t("more")}</span>"
              </p>

              {/* Placeholder for images */}
              <div className="grid grid-cols-2 gap-2 mb-4" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
                <div className="bg-gray-200 rounded-lg" style={{ gridRow: '1 / 3' }}></div>
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
              </div>

              <div className="flex items-center justify-between pt-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs">👍</div>
                    <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs">👏</div>
                    <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-xs">🤍</div>
                  </div>
                  <span className="text-sm text-gray-600">{t("likedBy")}</span>
                </div>
                <span className="text-sm text-gray-600">{t("commentsCount")}</span>
              </div>

              <div className="flex items-center pt-4 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Heart className="h-5 w-5 text-[#ED202D]" strokeWidth={2} />
                  <span className="text-sm font-medium">{t("like")}</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <MessageSquare className="h-5 w-5 text-[#2B7FFF]" strokeWidth={2} />
                  <span className="text-sm font-medium">{t("comment")}</span>
                </button>
              </div>
            </div>

            {/* Second Post - Golf Tournament */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden">
                    <Image
                      src="/assets/Profile Image.jpg"
                      alt={t("postAuthorName")}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#233389]">{t("postAuthorName")}</h3>
                    <p className="text-sm text-gray-600">{t("postAuthorTitle")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <Button variant="outline" size="sm" className="text-[#233389] border-[#233389] hover:bg-[#233389] hover:text-white">
                    <Plus className="h-4 w-4 mr-1" />
                    {t("follow")}
                  </Button>
                  <div className="relative" ref={(el) => (dropdownRefs.current['post2'] = el)}>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => toggleDropdown('post2')}
                    >
                      <MoreHorizontal className="h-5 w-5 text-[#233389]" />
                    </button>
                    {openDropdown === 'post2' && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left">
                          <Bookmark className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{t("save")}</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left rounded-b-lg">
                          <LinkIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{t("copyLink")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="aspect-video bg-gray-300 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src="/assets/Trees.jpg"
                  alt="Golf Tournament"
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#233389]/20 to-[#233389]/80" />
                {/* Date on gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm text-white font-medium mb-1">{t("eventDate")}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-xl font-bold text-[#233389] mb-4 pb-4 border-b border-gray-200">{t("eventTitle")}</h3>
                <Button variant="outline" className="w-full border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl">
                  {t("view")}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6">
            {/* Your Network */}
            <div>
              <h3 className="font-semibold text-[#233389] mb-4">{t("yourNetwork")}</h3>
              <div className="space-y-3">
                {networkContacts.map((contact, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                        <Image
                          src="/assets/Your Newtork Image.jpg"
                          alt={contact.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#233389]">{contact.name}</p>
                        <p className="text-xs text-gray-600">{contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MessageCircle className="h-4 w-4 text-[#233389]" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4 text-[#233389]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invitations */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-[#233389] mb-4">{t("invitations")} (10)</h3>
              <div className="space-y-3">
                {invitations.map((invitation, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
                        <Image
                          src={invitation.image}
                          alt={invitation.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#233389]">{invitation.name}</p>
                        <p className="text-xs text-gray-600">{t(invitation.messageKey)}</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm py-2 border border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl">
                {t("seeMore")}
              </button>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-[#233389] mb-4">{t("messages")} (5)</h3>
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                      <Image
                        src={message.image}
                        alt={message.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm text-[#233389]">{message.name}</p>
                        <span className="text-xs text-gray-500">{message.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{t(message.messageKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm py-2 border border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl">
                {t("seeMore")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
