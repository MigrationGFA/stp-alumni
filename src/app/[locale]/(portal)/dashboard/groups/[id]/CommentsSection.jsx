

import React, { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import {
  Image as ImageIcon,
  MessageCircle,

  SendHorizontal,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePostComments,
  useCommentOnPost,
} from "@/lib/hooks/useGroupQueries";

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
              isOverLimit && "focus-visible:ring-red-400/10",
            )}
          />

          {/* Word counter indicator */}
          {commentText.trim() && wordCount > 0 && (
            <div className="absolute -top-5 right-1 flex items-center gap-2">
              <span
                className={`text-[10px] font-medium ${getWordCountColor()}`}
              >
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
                : "bg-muted text-muted-foreground cursor-not-allowed",
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
              Press{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">
                Enter
              </kbd>{" "}
              to send
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
            <div
              key={c.commentId || c.id}
              className="flex items-start gap-2.5 group animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
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
                    `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
                    "Anonymous"}
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

export default CommentsSection