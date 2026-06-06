import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";


const searchService = {
    search: async (params) => {
        const response = await api.get('/search', { params });

        // Backend wraps response in status/error/message
        // Extract the actual data we need
        const res = response.data;

        if (res.error) {
            throw new Error(res.message || 'Search failed');
        }

        // Transform backend response to match frontend expectations
        return {
            data: res.data,           // { people: [], posts: [], ... }
            counts: res.counts,       // { people: 3, posts: 5, ... }
            pagination: {
                page: res.meta?.page || 1,
                limit: res.meta?.limit || 10,
                // Backend doesn't return total, so we estimate hasNextPage differently
            },
            query: res.query,
            type: res.type,
        };
    },
};


export const useSearch = (query, type = "all", page = 1, limit = 20) => {
    return useQuery({
        queryKey: ["search", query, type, page, limit],
        queryFn: () => searchService.search({ q: query, type, page, limit }),
        enabled: !!query && query.trim().length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook for infinite scroll
export const useInfiniteSearch = (query, type = "all", limit = 20) => {
    const [page, setPage] = useState(1);
    const [allResults, setAllResults] = useState(null);
    const queryClient = useQueryClient();

    // ✅ ALWAYS query with type="all" to keep counts accurate across all tabs
    // Filter on frontend based on active tab
    const { data, isLoading, isFetchingNextPage, error } = useQuery({
        queryKey: ["search", query, "all", page, limit],
        queryFn: () => searchService.search({ q: query, type: "all", page, limit }),
        enabled: !!query && query.trim().length > 0,
    });

    // Merge results as pages load
    useEffect(() => {
        if (data) {
            if (page === 1) {
                setAllResults(data);
            } else {
                setAllResults((prev) => {
                    if (!prev) return data;

                    const merged = { ...data };
                    // Merge each type's data array
                    Object.keys(data.data || {}).forEach((key) => {
                        if (prev.data && prev.data[key]) {
                            merged.data[key] = [...prev.data[key], ...(data.data[key] || [])];
                        }
                    });
                    merged.counts = data.counts;
                    merged.pagination = data.pagination;
                    return merged;
                });
            }
        }
    }, [data, page]);

    const fetchNextPage = useCallback(() => {
        if (!data?.data) return;

        // Since we always fetch "all", check total results
        // Calculate total items across all categories
        const totalResults = Object.values(data.data || {}).reduce(
            (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
            0
        );

        // If we got a full page of results, there might be more
        if (totalResults >= limit) {
            setPage((prev) => prev + 1);
        }
    }, [data, limit]);

    const resetSearch = useCallback(() => {
        setPage(1);
        setAllResults(null);
        queryClient.removeQueries({ queryKey: ["search"] });
    }, [queryClient]);

    // Calculate hasNextPage based on last page's result length
    const hasNextPage = !!data?.data && (() => {
        const totalResults = Object.values(data.data || {}).reduce(
            (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
            0
        );
        return totalResults >= limit;
    })();

    // ✅ Filter results based on active tab
    let filteredResults = allResults;
    if (allResults && type !== "all") {
        filteredResults = {
            ...allResults,
            data: {
                [type]: allResults.data[type] || [],
            },
            counts: allResults.counts,
        };
    }

    return {
        data: filteredResults,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        error,
        fetchNextPage,
        resetSearch,
    };
};

// Recent searches hook
export const useRecentSearches = (max = 5) => {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("recentSearches");
        if (stored) {
            try {
                setRecent(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent searches:", e);
            }
        }
    }, []);

    const addSearch = useCallback((query) => {
        if (!query || query.trim().length === 0) return;

        const trimmed = query.trim();
        setRecent((prev) => {
            const filtered = prev.filter((q) => q !== trimmed);
            const updated = [trimmed, ...filtered].slice(0, max);
            localStorage.setItem("recentSearches", JSON.stringify(updated));
            return updated;
        });
    }, [max]);

    const removeSearch = useCallback((query) => {
        setRecent((prev) => {
            const updated = prev.filter((q) => q !== query);
            localStorage.setItem("recentSearches", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearSearches = useCallback(() => {
        setRecent([]);
        localStorage.removeItem("recentSearches");
    }, []);

    return { recent, addSearch, removeSearch, clearSearches };
};