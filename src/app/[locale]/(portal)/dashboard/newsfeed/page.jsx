"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePostsFeed, useLikePost } from "@/lib/hooks/usePosts";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";
import PostSkeleton from "@/components/posts/PostSkeleton";
import { toast } from "sonner";

export default function NewsFeed() {
  const t = useTranslations("Newsfeed");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading, error, refetch } = usePostsFeed();
  const { mutate: likePost } = useLikePost();

  // console.log(posts,"post")

  // Filter posts by search query
  const filteredPosts = (posts || []).filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.body?.toLowerCase().includes(q) ||
      post.author?.name?.toLowerCase().includes(q)
    );
  });

  const handleLike = (postId) => likePost(postId);
  const handleComment = (postId) => console.log("Comment:", postId);
  const handleSave = () => toast.success(t("postSaved"));
  const handleCopyLink = () => toast.success(t("linkCopied"));

  return (
    <div className="space-y-6 p-3 sm:p-0">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#233389]">
        {t("title")}
      </h1>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-sm bg-transparent border border-[#233389]"
        />
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={refetch} />

      {/* Posts Feed */}
      {isLoading && (
        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {error && (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{t("loadError")}</p>
          <Button onClick={() => refetch()} className="bg-[#233389] hover:bg-[#1d2a6e] text-white">
            {t("tryAgain")}
          </Button>
        </div>
      )}

      {!isLoading && !error && filteredPosts.length > 0 && (
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post.id || index}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onSave={handleSave}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredPosts.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-2">{t("noPosts")}</p>
          <p className="text-sm text-gray-400">{t("noPostsHint")}</p>
        </div>
      )}
    </div>
  );
}
