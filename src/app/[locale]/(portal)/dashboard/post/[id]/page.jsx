"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  ChevronRight,
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
import { cn } from "@/lib/utils";

// Constants for word limits
const MAX_WORDS = 1250;
const WARNING_THRESHOLD = 0.8;

/**
 * CommentItem — renders a single comment bubble
 */
function CommentItem({ comment }) {
  return (
    <div className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
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
        <div className="bg-gray-100 hover:bg-gray-100/80 rounded-2xl rounded-tl-sm px-4 py-2.5 transition-colors duration-200">
          <Link
            href={`/dashboard/profile/${comment.authorId || comment.userId}`}
            className="text-sm font-semibold text-[#233389] leading-tight hover:underline"
          >
            {comment.firstName || comment.user?.name || "Anonymous"}{" "}
            {comment.lastName || ""}
          </Link>
          <p className="text-sm text-gray-700 mt-0.5 break-words leading-relaxed">
            {comment.comment}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 pl-2">
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

  const [commentText, setCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);
  const { data: currentUser } = useAuth();

  // Fetch post data
  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = usePostById(postId);

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

  // Calculate word count
  const wordCount = useMemo(() => {
    if (!commentText.trim()) return 0;
    return commentText.trim().split(/\s+/).length;
  }, [commentText]);

  const isOverLimit = wordCount > MAX_WORDS;
  const showWarning = wordCount > MAX_WORDS * WARNING_THRESHOLD;
  const wordPercentage = Math.min((wordCount / MAX_WORDS) * 100, 100);

  const getWordCountColor = () => {
    if (isOverLimit) return "text-red-500";
    if (showWarning) return "text-amber-500";
    return "text-emerald-500";
  };

  const getProgressColor = () => {
    if (isOverLimit) return "bg-red-500";
    if (showWarning) return "bg-amber-500";
    return "bg-emerald-500";
  };

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

  // Prevent body scroll when full image modal is open
  useEffect(() => {
    if (fullImageOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [fullImageOpen]);

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

  const handleCommentChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);
    
    if (words.length > MAX_WORDS && words.length > wordCount) {
      const trimmedValue = value.split(/\s+/).slice(0, MAX_WORDS).join(" ");
      setCommentText(trimmedValue);
      toast.warning(`Maximum ${MAX_WORDS} words allowed`);
    } else {
      setCommentText(value);
    }
  };

  const handleSubmitComment = () => {
    const text = commentText.trim();
    if (!text || isSubmitting || isOverLimit) return;

    addComment(
      { postId: postId, comment: text },
      {
        onSuccess: () => {
          setCommentText("");
          refetchComments();
          refetch();
          textareaRef.current?.focus();
          toast.success("Comment posted successfully!");
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

  const openFullImage = (index) => {
    setSelectedImageIndex(index);
    setFullImageOpen(true);
  };

  const closeFullImage = () => {
    setFullImageOpen(false);
  };

  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  // Keyboard navigation for full image view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullImageOpen) return;
      
      if (e.key === "Escape") {
        closeFullImage();
      } else if (e.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fullImageOpen, selectedImageIndex]);

  const canSubmit = commentText.trim() && !isOverLimit && !isSubmitting;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
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

  const images = post.images || [];
  const hasImages = images.length > 0;

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
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-300 overflow-hidden shrink-0 block ring-2 ring-white shadow-sm"
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

            {/* ── Post Body ── */}
            {(post.body || post.content) && (
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                  {post.body || post.content}
                </p>
              </div>
            )}

            {/* ── Post Images ── */}
            {hasImages && (
              <div
                className={`mb-4 gap-2 ${
                  images.length === 1 ? "grid grid-cols-1" : "grid grid-cols-2"
                }`}
                style={
                  images.length === 3
                    ? { gridTemplateRows: "repeat(2, minmax(0, 1fr))" }
                    : {}
                }
              >
                {images.map((image, index) => {
                  const isFirstOfThree = images.length === 3 && index === 0;
                  
                  return (
                    <div
                      key={index}
                      className={`relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer group ${
                        isFirstOfThree ? "row-span-2" : "aspect-video"
                      }`}
                      style={
                        isFirstOfThree ? { gridRow: "1 / 3" } : {}
                      }
                      onClick={() => openFullImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Overlay with zoom icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                          <svg className="h-5 w-5 text-[#233389]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Show +N overlay for last image if there are more than 3 */}
                      {index === 2 && images.length > 3 && (
                        <div 
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            openFullImage(2);
                          }}
                        >
                          <span className="text-white text-2xl font-bold">
                            +{images.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                        <div className="h-12 w-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-3">
                          <MessageSquare className="h-6 w-6 text-gray-300" />
                        </div>
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

              {/* Comment Input with Word Limit */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-3 items-end">
                  <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
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
                      onChange={handleCommentChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a comment…"
                      className={cn(
                        "resize-none min-h-[44px] max-h-[120px] pr-12 rounded-2xl border-2 text-sm py-2.5 bg-white transition-all duration-200",
                        isFocused
                          ? "border-[#233389] ring-4 ring-[#233389]/10"
                          : isOverLimit
                          ? "border-red-400"
                          : "border-gray-200 hover:border-gray-300",
                        isOverLimit && "focus-visible:ring-red-400/10"
                      )}
                      rows={1}
                    />
                    
                    {/* Word counter indicator */}
                    {commentText.trim() && wordCount > 0 && (
                      <div className="absolute -top-6 right-1 flex items-center gap-2">
                        <span className={`text-[10px] font-medium ${getWordCountColor()}`}>
                          {wordCount}/{MAX_WORDS}
                        </span>
                      </div>
                    )}
                    
                    {/* Progress bar */}
                    {commentText.trim() && wordCount > 0 && (
                      <div className="absolute -bottom-1.5 left-3 right-3 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${getProgressColor()}`}
                          style={{ width: `${Math.min(wordPercentage, 100)}%` }}
                        />
                      </div>
                    )}

                    <button
                      onClick={handleSubmitComment}
                      disabled={!canSubmit}
                      className={cn(
                        "absolute right-2.5 bottom-2.5 p-1.5 rounded-lg transition-all duration-200",
                        canSubmit
                          ? "text-[#233389] hover:bg-[#233389]/10 hover:scale-110 active:scale-95"
                          : "text-gray-300 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between mt-2 pl-12">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      ⌘ + Enter to send
                    </span>
                    {commentText.trim() && !isOverLimit && wordCount > 0 && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                          {MAX_WORDS - wordCount} words remaining
                        </span>
                      </>
                    )}
                  </div>
                  
                  {commentText.trim() && showWarning && (
                    <span className={`text-xs ${getWordCountColor()}`}>
                      {isOverLimit ? "⚠️ Limit exceeded" : "⚠️ Approaching limit"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Image Modal ── */}
      {fullImageOpen && hasImages && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeFullImage}
        >
          {/* Close button */}
          <button
            onClick={closeFullImage}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Main image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`Post image ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-w-[90vw] max-h-[90vh]"
            />
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 hover:bg-black/70 rounded-full"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 hover:bg-black/70 rounded-full"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Thumbnail navigation */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === selectedImageIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Instructions */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/40 text-xs">
            {images.length > 1 && "Use arrow keys to navigate • ESC to close"}
          </div>
        </div>
      )}
    </div>
  );
}