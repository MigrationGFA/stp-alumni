import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import groupService from '../services/groupService';

export const groupKeys = {
  all: ['groups'],
  detail: (id) => ['groups', id],
  members: (id) => ['groups', id, 'members'],
  posts: (id) => ['groups', id, 'posts'],
  comments: (groupId, postId) => ['groups', groupId, 'posts', postId, 'comments'],
};

// ─── Group ─────────────────────────────────────────────────────────────────

export function useGroupById(groupId) {
  return useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: async () => {
      const data = await groupService.getGroupById(groupId);
      return data?.data || data || null;
    },
    enabled: !!groupId,
    staleTime: 60 * 1000,
  });
}

export function useGroupMembers(groupId) {
  return useQuery({
    queryKey: groupKeys.members(groupId),
    queryFn: async () => {
      const data = await groupService.getGroupMembers(groupId);
      return data?.data || [];
    },
    enabled: !!groupId,
    staleTime: 30 * 1000,
  });
}

export function useToggleMembership(groupId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action) => groupService.toggleMembership(groupId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.members(groupId) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Action failed');
    },
  });
}

// ─── Posts ─────────────────────────────────────────────────────────────────

export function useGroupPosts(groupId) {
  return useInfiniteQuery({
    queryKey: groupKeys.posts(groupId),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await groupService.getGroupPosts(groupId, pageParam, 20);
      return data?.data || [];
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
    enabled: !!groupId,
    staleTime: 30 * 1000,
  });
}

export function useCreateGroupPost(groupId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, images }) => groupService.createGroupPost(groupId, body, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.posts(groupId) });
      toast.success('Post published');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to post');
    },
  });
}

export function useLikeGroupPost(groupId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => groupService.likeGroupPost(groupId, postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: groupKeys.posts(groupId) });
      const previous = queryClient.getQueryData(groupKeys.posts(groupId));
      // Optimistic toggle
      queryClient.setQueryData(groupKeys.posts(groupId), (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((post) =>
              post.postId === postId
                ? {
                    ...post,
                    hasUserLiked: !post.hasUserLiked,
                    likeCount: post.hasUserLiked
                      ? post.likeCount - 1
                      : post.likeCount + 1,
                  }
                : post,
            ),
          ),
        };
      });
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(groupKeys.posts(groupId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.posts(groupId) });
    },
  });
}

export function usePostComments(groupId, postId) {
  return useInfiniteQuery({
    queryKey: groupKeys.comments(groupId, postId),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await groupService.getPostComments(groupId, postId, pageParam, 20);
      return data?.data || [];
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
    enabled: !!groupId && !!postId,
    staleTime: 20 * 1000,
  });
}

export function useCommentOnPost(groupId, postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment) => groupService.commentOnPost(groupId, postId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.comments(groupId, postId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.posts(groupId) });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to comment');
    },
  });
}