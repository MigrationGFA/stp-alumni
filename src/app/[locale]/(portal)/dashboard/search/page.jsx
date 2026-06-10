"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Newspaper,
  Calendar,
  Hash,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  PeopleResultCard,
  PostResultCard,
  NewsResultCard,
  EventResultCard,
  GroupResultCard,
} from "./ResultCards";
import { useInfiniteSearch, useRecentSearches } from "./useSearch";
import { useSearchParams } from "next/navigation";
import { useNavbar } from "@/contexts/NavbarContext";

const searchTypes = [
  { key: "all", label: "All", icon: Search },
  { key: "people", label: "People", icon: Users },
  { key: "posts", label: "Posts", icon: FileText },
  { key: "newsfeed", label: "News", icon: Newspaper },
  { key: "events", label: "Events", icon: Calendar },
  { key: "groups", label: "Groups", icon: Hash },
];

export default function SearchPage() {
  const t = useTranslations("Search");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");

  const { recent, addSearch, removeSearch, clearSearches } =
    useRecentSearches(5);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    resetSearch,
  } = useInfiniteSearch(query, activeTab, 20);

  console.log(data,"data")

  const {
    userSize: { height },
  } = useNavbar();

  const observerRef = useRef();
  const lastResultRef = useRef();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("focusSearch") === "true") {
      sessionStorage.removeItem("focusSearch");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, []);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (currentQ === query) return;

    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/dashboard/search?${params.toString()}`, { scroll: false });
  }, [query, searchParams, router]);

  const lastAddedRef = useRef(null);

  useEffect(() => {
    if (
      query &&
      data &&
      !isLoading &&
      data.counts &&
      Object.values(data.counts).some((c) => c > 0) &&
      lastAddedRef.current !== query
    ) {
      lastAddedRef.current = query;
      addSearch(query);
    }
  }, [query, data, isLoading, addSearch]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    if (lastResultRef.current) {
      observerRef.current.observe(lastResultRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    resetSearch();
  };

  const clearSearch = () => {
    setQuery("");
    resetSearch();
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetSearch();
  };

  const getCount = (type) => {
  if (!data?.data) return 0;
  
  if (data?.counts) {
    if (type === "all") {
      return Object.values(data.counts).reduce((sum, count) => sum + count, 0);
    }
    return data.counts[type] || 0;
  }
  
  if (type === "all") {
    return Object.values(data.data).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  }
  return data.data[type]?.length || 0;
};

  const renderResults = () => {
    if (!data?.data) return null;

    if (activeTab === "all") {
      const sections = [];

      if (data.data.people?.length > 0) {
        sections.push(
          <div key="people" className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#155DFC]" />
                {t("people")} ({data.counts?.people || data.data.people.length })
              </h2>
            </div>
            <div className="space-y-3">
              {data.data.people.map((person, idx) => (
                <div
                  key={person.userId || idx}
                  ref={
                    idx === data.data.people.length - 1 ? lastResultRef : null
                  }
                >
                  <PeopleResultCard person={person} />
                </div>
              ))}
            </div>
          </div>,
        );
      }

      if (data.data.posts?.length > 0) {
        sections.push(
          <div key="posts" className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#155DFC]" />
                {t("posts")} ({data.counts?.posts || data.data.posts.length })
              </h2>
            </div>
            <div className="space-y-3">
              {data.data.posts.map((post, idx) => (
                <div
                  key={post.postId || idx}
                  ref={
                    idx === data.data.posts.length - 1 ? lastResultRef : null
                  }
                >
                  <PostResultCard post={post} />
                </div>
              ))}
            </div>
          </div>,
        );
      }

      if (data.data.newsfeed?.length > 0) {
        sections.push(
          <div key="newsfeed" className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-[#155DFC]" />
                {t("news")} ({data.counts?.newsfeed || data.data.newsfeed.length })
              </h2>
            </div>
            <div className="space-y-3">
              {data.data.newsfeed.map((news, idx) => (
                <div
                  key={news.postId || idx}
                  ref={
                    idx === data.data.newsfeed.length - 1 ? lastResultRef : null
                  }
                >
                  <NewsResultCard news={news} />
                </div>
              ))}
            </div>
          </div>,
        );
      }

      if (data.data.events?.length > 0) {
        sections.push(
          <div key="events" className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#155DFC]" />
                {t("events")} ({data.counts?.events || data.data.events.length })
              </h2>
            </div>
            <div className="space-y-3">
              {data.data.events.map((event, idx) => (
                <div
                  key={event.eventId || idx}
                  ref={
                    idx === data.data.events.length - 1 ? lastResultRef : null
                  }
                >
                  <EventResultCard event={event} />
                </div>
              ))}
            </div>
          </div>,
        );
      }

      if (data.data.groups?.length > 0) {
        sections.push(
          <div key="groups" className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-[#155DFC]" />
                {t("groups")} ({data.counts?.groups || data.data.groups.length })
              </h2>
            </div>
            <div className="space-y-3">
              {data.data.groups.map((group, idx) => (
                <div
                  key={group.groupId || idx}
                  ref={
                    idx === data.data.groups.length - 1 ? lastResultRef : null
                  }
                >
                  <GroupResultCard group={group} />
                </div>
              ))}
            </div>
          </div>,
        );
      }

      return sections.length > 0 ? sections : null;
    }

    const items = data.data[activeTab] || [];
    const renderCard = (item, idx) => {
      const props = {
        key: item[Object.keys(item)[0]] || idx,
        ref: idx === items.length - 1 ? lastResultRef : null,
      };

      switch (activeTab) {
        case "people":
          return <PeopleResultCard person={item} {...props} />;
        case "posts":
          return <PostResultCard post={item} {...props} />;
        case "newsfeed":
          return <NewsResultCard news={item} {...props} />;
        case "events":
          return <EventResultCard event={item} {...props} />;
        case "groups":
          return <GroupResultCard group={item} {...props} />;
        default:
          return null;
      }
    };

    return <div className="space-y-3">{items.map(renderCard)}</div>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Search Header - Mobile Optimized */}
      <div
        className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm"
        style={{ top: height }}
      >
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            <Input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full pl-9 sm:pl-12 pr-9 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base bg-slate-50 border-slate-200 focus:bg-white rounded-lg sm:rounded-xl"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </form>

          {/* Filter Tabs - Horizontal Scroll on Mobile */}
          <div className="mt-3 sm:mt-4">
  {/* Mobile/Tablet: 2-column grid with rounded pills */}
  <div className="grid grid-cols-2 gap-2 md:hidden">
    {searchTypes.map((type) => {
      const Icon = type.icon;
      const count = getCount(type.key);
      return (
        <button
          key={type.key}
          onClick={() => handleTabChange(type.key)}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === type.key
              ? "bg-[#155DFC] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{t(type.key)}</span>
          {count > 0 && (
            <Badge
              variant="secondary"
              className={`ml-1 px-1.5 py-0 text-xs ${
                activeTab === type.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {count}
            </Badge>
          )}
        </button>
      );
    })}
  </div>

  {/* Desktop: Horizontal scroll (md screens and above) */}
  <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
    {searchTypes.map((type) => {
      const Icon = type.icon;
      const count = getCount(type.key);
      return (
        <button
          key={type.key}
          onClick={() => handleTabChange(type.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            activeTab === type.key
              ? "bg-[#155DFC] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{t(type.key)}</span>
          {count > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 bg-white/20 text-inherit px-1.5 py-0 text-xs"
            >
              {count}
            </Badge>
          )}
        </button>
      );
    })}
  </div>
</div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* No query state */}
        {!query && (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {t("startSearching")}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 px-4">
              {t("searchHint")}
            </p>

            {/* Recent Searches */}
            {recent.length > 0 && (
              <div className="max-w-md mx-auto px-2 sm:px-0">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {t("recentSearches")}
                  </h3>
                  <button
                    onClick={() => clearSearches()}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    {t("clearHistory")}
                  </button>
                </div>
                <div className="space-y-2">
                  {recent.map((search, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200 hover:border-[#155DFC]/30 transition-colors group"
                    >
                      <button
                        onClick={() => setQuery(search)}
                        className="flex items-center gap-2 sm:gap-3 text-left flex-1 min-w-0"
                      >
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-slate-700 truncate">
                          {search}
                        </span>
                      </button>
                      <button
                        onClick={() => removeSearch(search)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State - Mobile Optimized */}
        {isLoading && (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-white animate-pulse"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 sm:h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              {t("searchError")}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4">{error.message}</p>
            <Button onClick={() => resetSearch()} variant="outline" size="sm" className="sm:size-default">
              {t("tryAgain")}
            </Button>
          </div>
        )}

        {/* Results */}
        {!isLoading && query && data && (
          <>
            {getCount(activeTab) === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <Search className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  {t("noResults")}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 px-4">
                  {t("noResultsHint", { query, type: t(activeTab) })}
                </p>
              </div>
            ) : (
              <>
                {renderResults()}

                {/* Infinite Scroll Loader */}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-6 sm:py-8">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#155DFC]" />
                  </div>
                )}

                {/* Sentinel for infinite scroll */}
                <div ref={lastResultRef} className="h-8 sm:h-10" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}