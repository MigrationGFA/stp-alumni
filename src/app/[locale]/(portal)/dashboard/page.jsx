"use client";
// import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Calendar, ShoppingBag, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useNavbar } from "@/contexts/NavbarContext";
import { useQuery } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { usePostsFeed, useLikePost } from "@/lib/hooks/usePosts";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import { toast } from "sonner";
import SidebarWidgets from "./SidebarWidgets";
import { useAuth } from "@/lib/hooks/useUser";

/**
 * Dashboard page - main landing page after login
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  const {
    userSize: { height },
  } = useNavbar();

  const {data} = useAuth()

  // Fetch posts using React Query
  const { data: posts, isLoading, error, refetch } = usePostsFeed();
  const { mutate: likePost } = useLikePost(data?.userId || "");

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

  // console.log(posts, "posts");

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
                <Button
                  onClick={() => refetch()}
                  className="bg-[#233389] hover:bg-[#1d2a6e]"
                >
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
                <p className="text-sm text-gray-400">
                  Be the first to share something!
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar Widgets */}

          <SidebarWidgets t={t} height={height} />
        </div>
      </div>
    </div>
  );
}
