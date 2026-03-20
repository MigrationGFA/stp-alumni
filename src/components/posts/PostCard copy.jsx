"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  MoreHorizontal,
  Heart,
  MessageSquare,
  Bookmark,
  Link as LinkIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "@/lib/helper";

/**
 * PostCard component - Displays a single post with interactions
 */
export default function PostCard({
  post,
  onLike,
  onComment,
  onFollow,
  onSave,
  onCopyLink,
}) {
  const t = useTranslations("Dashboard");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

console.log(post,"post")
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleLike = () => {
    onLike?.(post.id);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleFollow = () => {
    onFollow?.(post.author?.id);
  };

  const handleSave = () => {
    setOpenDropdown(false);
    onSave?.(post.id);
  };

  const handleCopyLink = () => {
    setOpenDropdown(false);
    const postUrl = `${window.location.origin}/dashboard/newsfeed/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    onCopyLink?.(post.id);
  };

  return (
    <div className="bg-white rounded-lg p-4 lg:p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden shrink-0">
            <Image
              src={post.profileImageUrl || "/assets/Profile Image.jpg"}
              alt={post.author?.name || "User"}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#233389]">
              {post.authorFirstName || "Anonymous"} {post.authorLastName}
            </h3>
            {post.author?.title && (
              <p className="text-sm text-gray-600">{post.author.title}</p>
            )}
            <p className="text-xs text-gray-500">
              {post.createdAt
                ? formatDistanceToNow(new Date(post.createdAt))
                : "Just now"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Follow Button */}
          {!post.author?.isFollowing && onFollow && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFollow}
              className="text-[#233389] border-[#233389] hover:bg-[#233389] hover:text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("follow")}
            </Button>
          )}

          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <MoreHorizontal className="h-5 w-5 text-[#233389]" />
            </button>
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleSave}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                >
                  <Bookmark className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{t("save")}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left rounded-b-lg"
                >
                  <LinkIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{t("copyLink")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
        {post.body || post.content}
      </p>

      {/* Post Images */}
      {Array.isArray(post.images) && post.images.length > 0 && (
        <div
          className={`mb-4 gap-2 ${
            post.images.length === 1
              ? "grid grid-cols-1"
              : post.images.length === 2
              ? "grid grid-cols-2"
              : "grid grid-cols-2"
          }`}
          style={
            post.images.length === 3
              ? { gridTemplateRows: "repeat(2, minmax(0, 1fr))" }
              : {}
          }
        >
          {post.images.map((image, index) => (
            <div
              key={index}
              className={`relative bg-gray-200 rounded-lg overflow-hidden ${
                post.images.length === 3 && index === 0
                  ? "row-span-2"
                  : "aspect-video"
              }`}
              style={
                post.images.length === 3 && index === 0
                  ? { gridRow: "1 / 3" }
                  : {}
              }
            >
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Engagement Metrics */}
      {(post.likes?.count > 0 || post.comments?.count > 0) && (
        <div className="flex items-center justify-between pt-4 mb-4">
          {post.likes?.count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs">
                  👍
                </div>
                <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs">
                  👏
                </div>
                <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-xs">
                  🤍
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {post.likes.count}{" "}
                {post.likes.count === 1 ? "like" : "likes"}
              </span>
            </div>
          )}
          {post.comments?.count > 0 && (
            <span className="text-sm text-gray-600">
              {post.comments.count}{" "}
              {post.comments.count === 1 ? "comment" : "comments"}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center pt-4 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 transition-colors ${
            post.likes?.isLiked
              ? "text-[#ED202D]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${
              post.likes?.isLiked ? "fill-[#ED202D]" : ""
            }`}
            strokeWidth={2}
          />
          <span className="text-sm font-medium">{t("like")}</span>
        </button>
        <button
          onClick={handleComment}
          className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-[#2B7FFF]" strokeWidth={2} />
          <span className="text-sm font-medium">{t("comment")}</span>
        </button>
      </div>
    </div>
  );
}
