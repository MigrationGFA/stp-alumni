"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { hotTopics, posts } from "@/lib/data";

const filterTabs = [
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending News" },
  { key: "technology", label: "Technology" },
  { key: "sector", label: "Sector" },
  { key: "interest", label: "Interest" },
];

export default function NewsFeed() {
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "popular" || post.category === activeTab;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <div className="space-y-6 p-3 sm:p-0">
        {/* Page Header */}
        <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light">
          News Feed
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Filter Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start sm:items-center">
              {/* Tabs - Horizontal scroll on mobile */}
              <div className="hidden md:flex items-center gap-2 overflow-x-hidden pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
             
                  {filterTabs.map((tab) => (
                    <Button
                      key={tab.key}
                      variant={activeTab === tab.key ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "whitespace-nowrap text-xs",
                        activeTab === tab.key
                          ? "bg-stp-blue-light text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
         

              {/* Search */}
              <div className="relative w-full sm:w-64 flex-1 ">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search author, topics and so on"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm  bg-transparent border border-stp-blue-light"
                />
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-[#1B2F5B]/5 rounded-xl border border-border overflow-hidden p-4"
                >
                  {/* Header: Title Card on top of Image */}
                  <div className="relative">
                    {/* Background Image */}
                    <div className="aspect-[2.5/1] overflow-hidden rounded-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title Card Overlay - positioned at bottom, overlapping image and content */}
                    <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 translate-y-1/2">
                      <div className="bg-white rounded-lg py-4 px-6 space-y-3">
                        <h2 className="text-sm sm:text-base font-semibold text-[#020618] leading-tight">
                          {post.title}
                        </h2>
                        {/* Author & Timestamp */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={post.author.avatar}
                                alt={post.author.name}
                              />
                              <AvatarFallback>
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-black text-sm text-stp-blue-light">
                              {post.author.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {post.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section - with padding top to account for overlapping title */}
                  <div className="py-4 px-10 sm:py-6 pt-12 mt-2 sm:pt-14 space-y-4">
                    {/* Content */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        size="sm"
                        className="bg-stp-blue-light text-primary-foreground"
                      >
                        Read more
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block lg:w-80 space-y-6 lg:sticky lg:top-25 lg:left-0 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
            {/* Hot Topics */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-semibold text-sm">Hot topics right now</h3>

              <div className="space-y-3">
                {hotTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {topic.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {topic.date}, {topic.time}
                      </p>
                    </div>
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-16 h-12 object-cover rounded-lg shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
