"use client";
import React, { useState, useRef,useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  LogOut,
  Image as ImageIcon,
  Video,
  BarChart3,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  Link2,
  Users,
  Info,
  Link,
  FlagIcon,
  SendHorizontal,
  ChevronDown,
  Loader2,
  X,
  UserCheck,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useGroupById,
  useGroupMembers,
  useToggleMembership,
  useGroupPosts,
  useCreateGroupPost,
  useLikeGroupPost,
  usePostComments,
  useCommentOnPost,
} from "@/lib/hooks/useGroupQueries";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Post Skeleton ────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

// ─── Comment Section ──────────────────────────────────────────────────────────

function CommentsSection({ groupId, postId, onClose }) {
  const [commentText, setCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  
  const { data, isLoading, fetchNextPage, hasNextPage } = usePostComments(
    groupId,
    postId,
  );
  const { mutate: submitComment, isPending } = useCommentOnPost(
    groupId,
    postId,
  );

  const comments = data?.pages.flat() || [];

  // Constants for word limits
  const MAX_WORDS = 1250;
  const WARNING_THRESHOLD = 0.8;

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
 
  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, []);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);
    
    if (words.length > MAX_WORDS && words.length > wordCount) {
      const trimmedValue = value.split(/\s+/).slice(0, MAX_WORDS).join(" ");
      setCommentText(trimmedValue);
    } else {
      setCommentText(value);
    }
  };

  const handleSubmit = () => {
    const text = commentText.trim();
    if (!text || isPending || isOverLimit) return;
    
    submitComment(text, {
      onSuccess: () => {
        setCommentText("");
        textareaRef.current?.focus();
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = commentText.trim() && !isOverLimit && !isPending;

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      {/* Input with Word Limit */}
      <div className="space-y-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={commentText}
            onChange={handleCommentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment…"
            className={cn(
              "min-h-[60px] resize-none text-sm flex-1 pr-12 transition-all duration-200",
              isFocused
                ? "border-stp-blue-light ring-2 ring-stp-blue-light/10"
                : isOverLimit
                ? "border-red-400"
                : "border-border",
              isOverLimit && "focus-visible:ring-red-400/10"
            )}
          />
          
          {/* Word counter indicator */}
          {commentText.trim() && wordCount > 0 && (
            <div className="absolute -top-5 right-1 flex items-center gap-2">
              <span className={`text-[10px] font-medium ${getWordCountColor()}`}>
                {wordCount}/{MAX_WORDS}
              </span>
            </div>
          )}
          
          {/* Progress bar */}
          {commentText.trim() && wordCount > 0 && (
            <div className="absolute -bottom-1.5 left-3 right-3 h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${getProgressColor()}`}
                style={{ width: `${Math.min(wordPercentage, 100)}%` }}
              />
            </div>
          )}

          {/* Send button inside textarea */}
          <Button
            size="icon"
            className={cn(
              "absolute right-1.5 bottom-1.5 h-8 w-8 rounded-full transition-all duration-200",
              canSubmit
                ? "bg-stp-blue-light hover:bg-stp-blue-light/90 text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SendHorizontal className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground">
              Press <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Enter</kbd> to send
            </span>
            {commentText.trim() && !isOverLimit && wordCount > 0 && (
              <>
                <span className="text-[10px] text-muted-foreground/30">•</span>
                <span className="text-[10px] text-muted-foreground">
                  {MAX_WORDS - wordCount} words remaining
                </span>
              </>
            )}
          </div>
          
          {commentText.trim() && showWarning && (
            <span className={`text-[10px] font-medium ${getWordCountColor()}`}>
              {isOverLimit ? "⚠️ Limit exceeded" : "⚠️ Approaching limit"}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6">
          <div className="h-12 w-12 rounded-full bg-muted/50 mx-auto flex items-center justify-center mb-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <p className="text-xs text-muted-foreground">
            No comments yet. Be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.commentId || c.id} className="flex items-start gap-2.5 group animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={c.authorAvatar || c.profileImagePath} />
                <AvatarFallback className="text-[10px] bg-stp-blue-light/10 text-stp-blue-light">
                  {getInitials(
                    c.authorName || `${c.firstName || ""} ${c.lastName || ""}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted hover:bg-muted/80 rounded-xl px-3 py-2 flex-1 min-w-0 transition-colors duration-200">
                <p className="text-xs font-semibold text-foreground truncate">
                  {c.authorName ||
                    `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Anonymous"}
                </p>
                <p className="text-sm text-foreground mt-0.5 leading-relaxed">
                  {c.comment || c.content}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatRelativeTime(c.createdAt)}
                </p>
              </div>
            </div>
          ))}
          {hasNextPage && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-stp-blue-light transition-colors"
              onClick={() => fetchNextPage()}
            >
              Load more comments
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post, groupId }) {
  const [showComments, setShowComments] = useState(false);
  const { mutate: likePost } = useLikeGroupPost(groupId);

  const authorName =
    post.authorName ||
    `${post.firstName || ""} ${post.lastName || ""}`.trim() ||
    "Member";
  const authorAvatar = post.authorAvatar || post.profileImagePath || null;
  const authorTitle = post.authorTitle || post.title || "";

     const handleCopyLink = () => {
    // setOpenDropdown(false);
    const postUrl = `${window.location.origin}/dashboard/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast.info("Copied Successfully")
    // onCopyLink?.(post.id);
  };


  return (
    <Card>
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={authorAvatar} alt={authorName} />
              <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold leading-tight">
                {authorName}
              </h3>
              {authorTitle && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {authorTitle}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem>
                <Bookmark className="h-4 w-4 mr-2" />
                Save post
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link2 className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="text-destructive focus:text-destructive">
                <FlagIcon className="h-4 w-4 mr-2" />
                Report post
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Body */}
        <p className="text-sm text-foreground mt-3 whitespace-pre-line leading-relaxed">
          {post.body || post.content}
        </p>

        {/* Images */}
        {post.images?.length > 0 && (
          <div
            className={cn(
              "mt-3 rounded-xl overflow-hidden gap-1",
              post.images.length === 1 ? "" : "grid grid-cols-2",
            )}
          >
            {post.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className={cn(
                  "relative overflow-hidden",
                  post.images.length === 1 ? "h-64" : "h-40",
                )}
              >
                <img
                  src={img.url || img}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {i === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{post.images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {(post.likeCount > 0 || post.commentCount > 0) && (
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            {post.likeCount > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                {post.likeCount.toLocaleString()}
              </span>
            )}
            {post.commentCount > 0 && (
              <button
                className="hover:underline ml-auto"
                onClick={() => setShowComments((v) => !v)}
              >
                {post.commentCount} comment{post.commentCount !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 text-sm",
              post.hasUserLiked
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground",
            )}
            onClick={() => likePost(post.postId || post.id)}
          >
            <Heart
              className={cn("h-4 w-4", post.hasUserLiked && "fill-red-500")}
            />
            {post.hasUserLiked ? "Liked" : "Like"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm text-muted-foreground"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="h-4 w-4" />
            Comment
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <CommentsSection
            groupId={groupId}
            postId={post.postId || post.id}
            onClose={() => setShowComments(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}

// ─── Create Post ──────────────────────────────────────────────────────────────

function CreatePostCard({ groupId, isMember }) {
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const { mutate: createPost, isPending } = useCreateGroupPost(groupId);

  // Constants for word limits
  const MAX_WORDS = 3000;
  const WARNING_THRESHOLD = 0.8;

  // Calculate word count
  const wordCount = useMemo(() => {
    if (!body.trim()) return 0;
    return body.trim().split(/\s+/).length;
  }, [body]);

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

  if (!isMember) return null;

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 4));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBodyChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);
    
    if (words.length > MAX_WORDS && words.length > wordCount) {
      const trimmedValue = value.split(/\s+/).slice(0, MAX_WORDS).join(" ");
      setBody(trimmedValue);
    } else {
      setBody(value);
    }
  };

  const handleSubmit = () => {
    const text = body.trim();
    if (!text || isPending || isOverLimit) return;
    
    createPost(
      { body: text, images },
      {
        onSuccess: () => {
          setBody("");
          setImages([]);
          textareaRef.current?.focus();
        },
      },
    );
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = body.trim() && !isOverLimit && !isPending;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-4 space-y-3">
        {/* Textarea with word limit */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Share something with the group…"
            value={body}
            onChange={handleBodyChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[72px] resize-none border-0 p-0 focus-visible:ring-0 text-sm transition-all duration-200",
              isFocused && "ring-2 ring-stp-blue-light/10 rounded-lg px-3 py-2 bg-muted/30",
              isOverLimit && "text-red-500 placeholder:text-red-300"
            )}
          />
          
          {/* Word counter indicator */}
          {body.trim() && wordCount > 0 && (
            <div className="absolute -top-6 right-1 flex items-center gap-2">
              <span className={`text-[10px] font-medium ${getWordCountColor()}`}>
                {wordCount}/{MAX_WORDS}
              </span>
            </div>
          )}
          
          {/* Progress bar */}
          {body.trim() && wordCount > 0 && (
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${getProgressColor()}`}
                style={{ width: `${Math.min(wordPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {images.map((file, i) => (
              <div
                key={i}
                className="relative h-16 w-16 rounded-lg overflow-hidden ring-2 ring-white shadow-sm group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-200"
                />
                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-0.5 right-0.5 h-5 w-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-stp-blue-light/10 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 4}
            >
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
            
            {/* Image counter */}
            {images.length > 0 && (
              <span className="text-[10px] text-muted-foreground ml-1">
                {images.length}/4
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Word count status */}
            {body.trim() && showWarning && (
              <span className={`text-[10px] font-medium ${getWordCountColor()}`}>
                {isOverLimit ? "⚠️ Limit" : `${MAX_WORDS - wordCount} left`}
              </span>
            )}
            
            <Button
              size="sm"
              className={cn(
                "rounded-full gap-1.5 transition-all duration-200",
                canSubmit
                  ? "bg-stp-blue-light hover:bg-stp-blue-light/90 text-white shadow-sm shadow-stp-blue-light/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SendHorizontal className="h-3.5 w-3.5" />
              )}
              Post
            </Button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground">
              ⌘ + Enter to post
            </span>
            {body.trim() && !isOverLimit && wordCount > 0 && (
              <>
                <span className="text-[10px] text-muted-foreground/30">•</span>
                <span className="text-[10px] text-muted-foreground">
                  {MAX_WORDS - wordCount} words remaining
                </span>
              </>
            )}
          </div>
          {body.trim() && wordCount > 0 && (
            <span className={`text-[10px] ${getWordCountColor()}`}>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Members Modal ────────────────────────────────────────────────────────────

function MembersModal({ open, onOpenChange, groupId }) {
  const { data: members = [], isLoading } = useGroupMembers(groupId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
            {members.length > 0 && (
              <Badge variant="secondary">{members.length}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3 pr-2">
              {members.map((m) => {
                const name =
                  m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim();
                return (
                  <div
                    key={m.userId || m.id}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={m.profileImagePath || m.avatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{name}</p>
                      {(m.title || m.companyName) && (
                        <p className="text-xs text-muted-foreground truncate">
                          {m.title}
                          {m.title && m.companyName ? " · " : ""}
                          {m.companyName}
                        </p>
                      )}
                    </div>
                    {m.memberRole === "ADMIN" && (
                      <Badge variant="secondary" className="text-[10px]">
                        Admin
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GroupDetailView({ params }) {
  const { id } = React.use(params);
  const [membersOpen, setMembersOpen] = useState(false);

  const { data: group, isLoading: groupLoading } = useGroupById(id);
  const { data: members = [] } = useGroupMembers(id);
  const {
    data: postsData,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGroupPosts(id);
  const { mutate: toggleMembership, isPending: isTogglingMembership } =
    useToggleMembership(id);

  const posts = postsData?.pages.flat() || [];
  const isMember = group?.isMember ?? false;
  const memberRole = group?.memberRole || null;

  // Find admin from members list
  const admin = members.find((m) => m.memberRole === "ADMIN");

  // Suggested groups placeholder — replace with real query when endpoint available
  const suggestedGroups = [];

  if (groupLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            {[1, 2].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Group Details | Blazing Torrent</title>
        <meta
          name="description"
          content={group?.description || "Discover and connect with alumni in your group."}
        />
      </Helmet>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Group header card */}
            <Card className="overflow-hidden pt-0">
              <div className="relative h-36 sm:h-48 w-full">
                {group?.coverImagePath || group?.thumbnail ? (
                  <img
                    src={group.coverImagePath || group.thumbnail}
                    alt={group?.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stp-blue-light/80 to-stp-blue-light/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Group icon */}
                <div className="absolute -bottom-8 left-4 sm:left-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl p-1 shadow-xl">
                    <div className="w-full h-full bg-gradient-to-br from-stp-blue-light to-stp-blue-light/70 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="pt-3">
                {/* Actions row */}
                <div className="flex items-center justify-end gap-1 mb-2">
                  {/* Join/Leave button */}
                  {isMember ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1.5 text-xs"
                      disabled={isTogglingMembership}
                      onClick={() => toggleMembership("LEAVE")}
                    >
                      {isTogglingMembership ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5" />
                      )}
                      Joined
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-full gap-1.5 text-xs bg-stp-blue-light hover:bg-stp-blue-light/90 text-white"
                      disabled={isTogglingMembership}
                      onClick={() => toggleMembership("JOIN")}
                    >
                      {isTogglingMembership ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserPlus className="h-3.5 w-3.5" />
                      )}
                      Join Group
                    </Button>
                  )}

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4 text-stp-blue-light" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 text-sm">
                      {group?.description || "No description available."}
                    </HoverCardContent>
                  </HoverCard>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-stp-blue-light" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(window.location.href)
                        }
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Copy link to group
                      </DropdownMenuItem>
                      {isMember && (
                        <DropdownMenuItem
                          onClick={() => toggleMembership("LEAVE")}
                          className="text-destructive focus:text-destructive"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Leave this group
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <FlagIcon className="h-4 w-4 mr-2" />
                        Report this group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h1 className="text-xl font-bold text-foreground mt-1">
                  {group?.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {group?.memberCount?.toLocaleString() ?? members.length}{" "}
                    members
                  </span>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {(group?.privacyMode || "Public").toLowerCase()} group
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Create post */}
            <CreatePostCard groupId={id} isMember={isMember} />

            {/* Filter tabs */}
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-stp-blue-light text-white cursor-pointer"
              >
                All
              </Badge>
              {/* <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Recommended
            </Badge> */}
            </div>

            {/* Posts */}
            {postsLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No posts yet</p>
                  {isMember && (
                    <p className="text-xs mt-1">Be the first to post!</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard
                    key={post.postId || post.id}
                    post={post}
                    groupId={id}
                  />
                ))}
                {hasNextPage && (
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    )}
                    Load more posts
                  </Button>
                )}
              </>
            )}
          </div>

          {/* ── Sticky sidebar ── */}
          <div className="lg:sticky lg:top-25 space-y-4">
            {/* Members card */}
            <Card>
              <CardContent className="pt-4">
                <h3 className="text-2xl font-bold text-foreground">
                  {(group?.memberCount ?? members.length).toLocaleString()}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">members</p>

                {/* Member avatar stack */}
                {members.length > 0 && (
                  <div className="flex items-center mt-3 -space-x-2">
                    {members.slice(0, 5).map((m, i) => {
                      const name =
                        m.name ||
                        `${m.firstName || ""} ${m.lastName || ""}`.trim();
                      return (
                        <Avatar
                          key={m.userId || i}
                          className="h-7 w-7 ring-2 ring-background"
                        >
                          <AvatarImage src={m.profileImagePath || m.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {members.length > 5 && (
                      <div className="h-7 w-7 rounded-full bg-muted ring-2 ring-background flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          +{members.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  className="w-full mt-4 bg-stp-blue-light hover:bg-stp-blue-light/90 text-white rounded-full"
                  onClick={() => setMembersOpen(true)}
                >
                  Show all members
                </Button>
              </CardContent>
            </Card>

            {/* Admin card */}
            {admin && (
              <Card>
                <CardContent className="pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Admin
                  </h4>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={admin.profileImagePath || admin.avatar}
                      />
                      <AvatarFallback>
                        {getInitials(
                          admin.name ||
                            `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {admin.name ||
                          `${admin.firstName || ""} ${admin.lastName || ""}`.trim()}
                      </p>
                      {(admin.title || admin.companyName) && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {admin.title}
                          {admin.title && admin.companyName ? " · " : ""}
                          {admin.companyName}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About card */}
            {group?.description && (
              <Card>
                <CardContent className="pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    About
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {group.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Members modal */}
        <MembersModal
          open={membersOpen}
          onOpenChange={setMembersOpen}
          groupId={id}
        />
      </div>
    </>
  );
}
