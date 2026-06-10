"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Link as LinkIcon,
  Plus,
  Send,
  Loader2,
  Check,
  ChevronLeft,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "@/lib/helper";
import {
  usePostComments,
  useCommentPost,
  useLikePost,
  usePostById,
} from "@/lib/hooks/usePosts";
import { useAuth } from "@/lib/hooks/useUser";
import { Link } from "@/i18n/routing";
import { useQuery } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { toast } from "sonner";

// Fetch single post by ID
const fetchPostById = async (postId) => {
  const response = await networkService.get(`/posts/${postId}`);
  return response.data;
};

/**
 * CommentItem — renders a single comment bubble
 */
function CommentItem({ comment }) {
  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
        <Image
          src={
            comment.profileImagePath ||
            comment.user?.profileImage ||
            "/assets/Profile Image.jpg"
          }
          alt={comment.firstName || comment.user?.name || "User"}
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
          <Link
            href={`/dashboard/profile/${comment.authorId || comment.userId}`}
            className="text-sm font-semibold text-[#233389] leading-tight hover:underline"
          >
            {comment.firstName || comment.user?.name || "Anonymous"}{" "}
            {comment.lastName || ""}
          </Link>
          <p className="text-sm text-gray-700 mt-0.5 break-words">
            {comment.comment}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1 pl-2">
          {comment.createdAt
            ? formatDistanceToNow(new Date(comment.createdAt))
            : "Just now"}
        </p>
      </div>
    </div>
  );
}

/**
 * PostPage — Single post view page
 */
export default function PostPage({params}) {
  const param = React.use(params);
  const router = useRouter();
  const postId = param.id;
  const t = useTranslations("Dashboard");

  console.log(param,"postId")

  const [commentText, setCommentText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);
  const { data: currentUser } = useAuth();

  // Fetch post data
  const {
    data: post,
    isLoading,
    error,
    // refetch,
  } = usePostById(postId)

  // Fetch comments
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error: commentsError,
    refetch: refetchComments,
  } = usePostComments(postId);

  const comments = commentsData?.data || [];

  // Like mutation
  const { mutate: likePost, isPending: isLiking } = useLikePost(
    currentUser?.data?.userId || ""
  );

  // Comment mutation
  const { mutate: addComment, isPending: isSubmitting } = useCommentPost();

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Auto-focus textarea
  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const handleLike = () => {
    if (!post) return;
    likePost(postId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleSave = () => {
    setOpenDropdown(false);
    toast.success("Post saved!");
  };

  const handleCopyLink = () => {
    setOpenDropdown(false);
    const postUrl = `${window.location.origin}/dashboard/post/${postId}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleSubmitComment = () => {
    const text = commentText.trim();
    if (!text || isSubmitting) return;

    addComment(
      { postId: postId, comment: text },
      {
        onSuccess: () => {
          setCommentText("");
          refetchComments();
          refetch(); // Refresh post to update comment count
          textareaRef.current?.focus();
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Back button skeleton */}
          <div className="mb-6">
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Post skeleton */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="flex gap-4 pt-4 border-t">
              <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Post not found
            </h3>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-[#233389] hover:bg-[#1d2a6e]"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Post Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* ── Post Header ── */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <Link
                  href={`/dashboard/profile/${post.authorId}`}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-300 overflow-hidden shrink-0 block"
                >
                  <Image
                    src={post.profileImagePath || "/assets/Profile Image.jpg"}
                    alt={post.firstName || "User"}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div>
                  <Link
                    href={`/dashboard/profile/${post.authorId}`}
                    className="hover:underline"
                  >
                    <h3 className="font-semibold text-[#233389] text-sm sm:text-base">
                      {post.firstName || "Anonymous"} {post.lastName || "User"}
                    </h3>
                  </Link>
                  {post?.title && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      {post.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {post.createdAt
                      ? formatDistanceToNow(new Date(post.createdAt))
                      : "Just now"}
                  </p>
                </div>
              </div>

              {/* Three-dot Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                      <span className="text-sm text-gray-900">
                        {t("save")}
                      </span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left rounded-b-lg"
                    >
                      <LinkIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">
                        {t("copyLink")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Post Body with Read More ── */}
            {(post.body || post.content) && (
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                  {post.body || post.content}
                </p>
              </div>
            )}

            {/* ── Post Images ── */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <div
                className={`mb-4 gap-2 ${
                  post.images.length === 1
                    ? "grid grid-cols-1"
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
                      className="object-cover cursor-pointer"
                      onClick={() => window.open(image, "_blank")}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Engagement Metrics ── */}
            {(post.likeCount > 0 || post.commentCount > 0) && (
              <div className="flex items-center justify-between pt-4 mb-4 border-t border-gray-100">
                {post.likeCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs">
                        👍
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {post.likeCount}{" "}
                      {post.likeCount === 1 ? "like" : "likes"}
                    </span>
                  </div>
                )}
                {post.commentCount > 0 && (
                  <span className="text-sm text-gray-600">
                    {post.commentCount}{" "}
                    {post.commentCount === 1 ? "comment" : "comments"}
                  </span>
                )}
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex items-center pt-4 border-t border-gray-200">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                  post.hasUserLiked
                    ? "text-[#ED202D]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {isLiking ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${
                      post.hasUserLiked ? "fill-[#ED202D]" : ""
                    }`}
                    strokeWidth={2}
                  />
                )}
                <span className="text-sm font-medium">
                  {post.hasUserLiked ? t("like") : t("like")}
                </span>
              </button>

              <button
                onClick={() => textareaRef.current?.focus()}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-[#2B7FFF]" strokeWidth={2} />
                <span className="text-sm font-medium">{t("comment")}</span>
              </button>
            </div>
          </div>

          {/* ── Comments Section ── */}
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#233389] mb-4">
                Comments {comments.length > 0 ? `(${comments.length})` : ""}
              </h3>

              {/* Comments List */}
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4">
                  {isLoadingComments && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#233389]" />
                    </div>
                  )}

                  {commentsError && (
                    <p className="text-center text-sm text-red-500 py-4">
                      Failed to load comments. Please try again.
                    </p>
                  )}

                  {!isLoadingComments &&
                    !commentsError &&
                    comments.length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No comments yet.</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Be the first to comment!
                        </p>
                      </div>
                    )}

                  {!isLoadingComments &&
                    comments.map((comment, idx) => (
                      <CommentItem key={comment.id || idx} comment={comment} />
                    ))}
                </div>
              </ScrollArea>

              {/* Comment Input */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-3 items-end">
                  <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <Image
                      src={
                        currentUser?.data?.profileImagePath ||
                        "/assets/Profile Image.jpg"
                      }
                      alt="You"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a comment…"
                      className="resize-none min-h-[44px] max-h-[120px] pr-12 rounded-2xl border-gray-200 focus-visible:ring-[#233389] text-sm py-2.5 bg-white"
                      rows={1}
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmitting}
                      className="absolute right-3 bottom-2.5 text-[#233389] disabled:text-gray-300 transition-colors hover:text-[#1d2a6e]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 pl-12">
                  Ctrl + Enter to send
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}