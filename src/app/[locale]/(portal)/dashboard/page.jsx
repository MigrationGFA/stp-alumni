"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  MessageCircle,
  MoreVertical,
  MoreHorizontal,
  Calendar,
  ShoppingBag,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavbar } from "@/contexts/NavbarContext";
import { messages } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { usePostsFeed, useLikePost } from "@/lib/hooks/usePosts";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import { toast } from "sonner";
import { ModernScrollArea } from "@/components/shared/ScrollArea";

/**
 * Dashboard page - main landing page after login
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  const {
    userSize: { height },
  } = useNavbar();

  // Fetch posts using React Query
  const { data: posts, isLoading, error, refetch } = usePostsFeed();
  const { mutate: likePost } = useLikePost();
  
  // Fetch your network data
  const { data: networkData, isLoading: isLoadingNetwork } = useQuery({
    queryKey: ["network"],
    queryFn: () => networkService.getNetwork(),
  });
  
  // Fetch invitations/connections data
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => networkService.getConnections(),
  });
  // console.log("networkData",networkData)

  // Parse mapped network payload safely
  const rawNetwork = networkData?.data || networkData || {};
  const networkContacts = Array.isArray(rawNetwork.networkUsers)
    ? rawNetwork.networkUsers.slice(0, 5)
    : [];

  // Parse mapped invitations safely (assuming response is array or .data array)
  // Filtering loosely for "pending" status if available; else relying on API struct
  const rawConnections = Array.isArray(connectionsData?.data)
    ? connectionsData.data
    : Array.isArray(connectionsData)
      ? connectionsData
      : [];

  const invitations = rawConnections
    .filter((conn) => conn.status?.toLowerCase() === "pending")
    .slice(0, 5);

  // Handlers
  const handleLike = (postId) => {
    likePost(postId);
  };

  const handleComment = (postId) => {
    // TODO: Open comment modal or navigate to post detail
    console.log("Comment on post:", postId);
  };

  const handleFollow = (userId) => {
    // TODO: Implement follow functionality
    console.log("Follow user:", userId);
    toast.success("Follow feature coming soon!");
  };

  const handleSave = (postId) => {
    // TODO: Implement save functionality
    console.log("Save post:", postId);
    toast.success("Post saved!");
  };

  const handleCopyLink = (postId) => {
    toast.success("Link copied to clipboard!");
  };

  console.log(posts,"jgoegnorg")

  return (
    <div className="p-3 sm:p-0">
      {/* <div className="min-h-screen bg-[#E8ECF4]"> */}
      {/* Header */}
      {/* <header className="px-52 py-4">
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
      </header> */}

      {/* Main Content */}
      <div className="">
        {/* Dashboard Title */}
        <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light mb-6">
          {t("title")}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-20">
          {/* Left Column - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* E-Learning Course Banner */}
            <div
              className="rounded-xl overflow-hidden p-4 lg:p-8 text-white"
              style={{
                background:
                  "linear-gradient(132.7deg, #ED202D -39.31%, #233389 71.64%, #FBAD17 159.79%)",
              }}
            >
              <p className="text-sm font-light tracking-[0.3em] mb-3">
                CONNECT SHARE PARTICIPATE
              </p>
              <h2 className="text-xl lg:text-3xl font-bold mb-4 max-w-md">
                {t("courseTitle")}
              </h2>
              <Link href={"/dashboard/events"}>
                <Button className="bg-[#ED202D] hover:bg-[#d01824] text-white rounded-full px-4 flex items-center gap-2 cursor-pointer">
                  {t("joinNow")}
                  <span className="bg-white rounded-full p-1">
                    <ChevronRight className="h-4 w-4 text-black" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                {
                  href: "/dashboard/network",
                  icon: Globe,
                  bgColor: "bg-[rgba(237,32,45,0.08)]",
                  iconColor: "text-[#ED202D]",
                  labelKey: "networking",
                  // isLink: true,
                },
                {
                  href: "/dashboard/events",
                  icon: Calendar,
                  bgColor: "bg-[rgba(54,124,255,0.08)]",
                  iconColor: "text-[#367CFF]",
                  labelKey: "events",
                },
                {
                  href: "/dashboard/marketplace",
                  icon: ShoppingBag,
                  bgColor: "bg-[rgba(251,173,23,0.08)]",
                  iconColor: "text-[#FBAD17]",
                  labelKey: "marketplace",
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex-1 flex flex-row items-center justify-start gap-2 py-3 lg:py-4"
                  >
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {t(action.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Post Creation */}
            <CreatePost onPostCreated={refetch} />

            {/* News Feed */}
            {isLoading && (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}

            {error && (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">Failed to load posts</p>
                <Button onClick={() => refetch()} className="bg-[#233389] hover:bg-[#1d2a6e]">
                  Try Again
                </Button>
              </div>
            )}

            {!isLoading && !error && posts && posts.length > 0 && (
              <>
                {posts.map((post, index) => (
                  <PostCard
                    key={post.id || index}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onFollow={handleFollow}
                    onSave={handleSave}
                    onCopyLink={handleCopyLink}
                  />
                ))}
              </>
            )}

            {!isLoading && !error && (!posts || posts.length === 0) && (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 mb-4">No posts yet</p>
                <p className="text-sm text-gray-400">Be the first to share something!</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar Widgets */}

          <aside
            className="sticky left-0  w-full overflow-y-auto"
            style={{
              top: `${height + 10}px`,
              height: `calc(100dvh - ${height}px)`,
            }}
          >
            <ModernScrollArea
              className={` w-full`}
              // style={{
              //   height: `calc(100vh - ${height}px - 1rem)`,
              // }}
            >
              <div className="space-y-6">
                {/* Your Network */}
                <div>
                  <h3 className="font-semibold text-[#233389] mb-4">
                    {t("yourNetwork")}
                  </h3>
                  <div className="space-y-3">
                    {isLoadingNetwork ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#233389]"></div>
                      </div>
                    ) : networkContacts.length > 0 ? (
                      networkContacts.map((contact, index) => (
                        <div
                          key={contact.id || index}
                          className="bg-white rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                              <Image
                                src={contact.profileImageUrl || "/assets/Your Newtork Image.jpg"}
                                alt={contact.name || contact.firstName || "User"}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs text-[#233389] truncate">
                                {contact.firstName || "Anonymous"} {contact.lastName}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {contact.role || contact.email || "Member"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MessageCircle className="h-4 w-4 text-[#233389]" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="h-4 w-4 text-[#233389]" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg">
                        Go connect to build your network!
                      </div>
                    )}
                  </div>
                </div>

                {/* Invitations */}
                <div className="bg-white rounded-lg p-4 lg:p-6">
                  <h3 className="font-semibold text-[#233389] mb-4">
                    {t("invitations")} {invitations.length > 0 ? `(${invitations.length})` : ''}
                  </h3>
                  <div className="space-y-3">
                    {isLoadingConnections ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#233389]"></div>
                      </div>
                    ) : invitations.length > 0 ? (
                      invitations.map((invitation, index) => (
                        <div
                          key={invitation.id || index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                              <Image
                                src={invitation.user?.profileImage || invitation.image || "/assets/Your Newtork Image.jpg"}
                                alt={invitation.user?.name || invitation.name || "User"}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-[#233389] truncate">
                                {invitation.user?.name || invitation.name || "Pending User"}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                Pending connection request
                              </p>
                            </div>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded shrink-0">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No pending invitations.
                      </p>
                    )}
                  </div>
                  {invitations.length > 0 && (
                    <button className="w-full mt-4 text-center text-sm py-2 border border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl transition-colors">
                      {t("seeMore")}
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="bg-white rounded-lg p-4 lg:p-6">
                  <h3 className="font-semibold text-[#233389] mb-4">
                    {t("messages")} (5)
                  </h3>
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
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
                            <p className="font-medium text-sm text-[#233389]">
                              {message.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {message.date}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {t(message.messageKey)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-center text-sm py-2 border border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl">
                    {t("seeMore")}
                  </button>
                </div>
              </div>
            </ModernScrollArea>
          </aside>
        </div>
      </div>
    </div>
  );
}
