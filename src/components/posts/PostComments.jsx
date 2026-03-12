"use client";
import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostComments, useCommentPost } from "@/lib/hooks/usePosts";
import { formatDistanceToNow } from "@/lib/helper";

/**
 * PostComments component - Display and add comments
 */
export default function PostComments({ postId }) {
  const [commentText, setCommentText] = useState("");
  const { data: comments, isLoading } = usePostComments(postId);
  const { mutate: addComment, isLoading: isCommenting } = useCommentPost();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(
      { postId, comment: commentText },
      {
        onSuccess: () => {
          setCommentText("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment List */}
      {comments && comments.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden shrink-0">
                <Image
                  src={comment.author?.avatar || "/assets/Profile Image.jpg"}
                  alt={comment.author?.name || "User"}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-semibold text-sm text-[#233389]">
                    {comment.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.createdAt
                    ? formatDistanceToNow(new Date(comment.createdAt))
                    : "Just now"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#233389]"
          disabled={isCommenting}
        />
        <Button
          type="submit"
          disabled={!commentText.trim() || isCommenting}
          className="bg-[#233389] hover:bg-[#1d2a6e] text-white rounded-full px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
