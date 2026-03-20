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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Page Header */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stp-blue-light">
        News Feed
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Tabs - Horizontal scroll on mobile, wrap on tablet */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3",
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

            {/* Search - Full width on mobile, fixed width on desktop */}
            <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search author, topics and so on"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm bg-transparent border border-stp-blue-light w-full"
              />
            </div>
          </div>

          {/* Posts Grid - Responsive layout */}
          <div className="space-y-4 sm:space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[#1B2F5B]/5 rounded-xl border border-border overflow-hidden"
              >
                {/* Header: Title Card on top of Image */}
                <div className="relative">
                  {/* Background Image - Responsive aspect ratio */}
                  <div className="aspect-[3/1] sm:aspect-[2.5/1] md:aspect-[3/1] lg:aspect-[2.5/1] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title Card Overlay - Responsive positioning and sizing */}
                  <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 md:left-6 md:right-6 translate-y-1/2">
                    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-[#020618] leading-tight line-clamp-2">
                        {post.title}
                      </h2>
                      
                      {/* Author & Timestamp - Responsive layout */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarImage
                              src={post.author.avatar}
                              alt={post.author.name}
                            />
                            <AvatarFallback className="text-xs sm:text-sm">
                              {post.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-black text-xs sm:text-sm text-stp-blue-light truncate max-w-[150px] sm:max-w-none">
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

                {/* Content Section - Responsive padding */}
                <div className="p-3 sm:p-4 md:p-6 pt-8 sm:pt-10 md:pt-12 lg:pt-14 space-y-3 sm:space-y-4">
                  {/* Content with truncation for mobile */}
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {post.excerpt}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line hidden sm:block">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions - Responsive layout */}
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 xs:gap-2 pt-2">
                    <Button
                      size="sm"
                      className="bg-stp-blue-light text-primary-foreground w-full xs:w-auto text-xs sm:text-sm"
                    >
                      Read more
                    </Button>

                    <div className="flex items-center justify-center xs:justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, shown on tablet and desktop */}
        <div className="hidden md:block md:w-64 lg:w-80 space-y-4 md:space-y-6">
          {/* Hot Topics */}
          <div className="bg-card rounded-xl border border-border p-4 md:p-5 space-y-3 md:space-y-4 sticky top-4">
            <h3 className="font-semibold text-sm md:text-base">Hot topics right now</h3>

            <div className="space-y-3 md:space-y-4">
              {hotTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex gap-2 md:gap-3 cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-stp-blue-light transition-colors">
                      {topic.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {topic.date}
                    </p>
                  </div>
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-14 h-10 sm:w-16 sm:h-12 object-cover rounded-lg shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Add this to your global CSS or component for custom breakpoints */}
    <style jsx>{`
      @media (min-width: 480px) {
        .xs\\:flex-row {
          flex-direction: row;
        }
        .xs\\:items-center {
          align-items: center;
        }
        .xs\\:justify-end {
          justify-content: flex-end;
        }
        .xs\\:w-auto {
          width: auto;
        }
      }
    `}</style>
  </>
);
}