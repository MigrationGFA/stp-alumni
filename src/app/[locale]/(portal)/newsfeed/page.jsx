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

const posts = [
  {
    id: 1,
    title:
      "Leon Cooperman says future stock market returns will be 'unimpressive for a long time'. We totally, generally disagree.",
    excerpt:
      "Billionaire investor Leon Cooperman warned on Monday that long-term market returns could be lackluster because this year's incredible comeback will likely rob returns from the future.",
    content:
      '"The overall market, we\'ve been pulling a lot of demand forward. I would expect that future returns will be relatively unimpressive for a long time," Cooperman said Monday on CNBC\'s "Squawk Box."\n\nCooperman said when people realize most of the gains are because of government help, valuations for the stock market will come down.',
    author: {
      name: "Axe Capital",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    },
    timestamp: "Today, 7:00PM",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    likes: 42,
    comments: 12,
    category: "popular",
  },
  {
    id: 2,
    title: "Unlocking the Mysteries of Space: Humanity's Final Frontier",
    excerpt:
      "Space exploration continues to push the boundaries of human knowledge and technological innovation.",
    content:
      "From the depths of black holes to the search for extraterrestrial life, scientists are making groundbreaking discoveries that reshape our understanding of the cosmos.",
    author: {
      name: "Space Monger",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    timestamp: "30 minutes ago",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    likes: 128,
    comments: 34,
    category: "technology",
  },
  {
    id: 3,
    title: "The Rise of AI in Healthcare: Transforming Patient Care",
    excerpt:
      "Artificial intelligence is revolutionizing how we diagnose and treat diseases.",
    content:
      "Machine learning algorithms can now detect cancer earlier than ever before, while AI-powered robots assist in complex surgeries with unprecedented precision.",
    author: {
      name: "Health Tech Daily",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    },
    timestamp: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop",
    likes: 89,
    comments: 23,
    category: "technology",
  },
  {
    id: 4,
    title: "Sustainable Investing: The Future of Finance",
    excerpt:
      "ESG investing is no longer a niche strategy but a mainstream approach.",
    content:
      "Investors are increasingly recognizing that companies with strong environmental, social, and governance practices often outperform their peers over the long term.",
    author: {
      name: "Green Finance Hub",
      avatar:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    },
    timestamp: "4 hours ago",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
    likes: 56,
    comments: 18,
    category: "sector",
  },
];

const hotTopics = [
  {
    id: 1,
    title: "Lead with a Grounded Confidence in a Changing...",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    title: "Lead with a Grounded Confidence in a Changing...",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    image:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    title: "Lead with a Grounded Confidence in a Changing...",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=100&h=100&fit=crop",
  },
];

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
          <div className="hidden lg:block lg:w-80 space-y-6">
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
