import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import postService from '../services/postService';
import usePostStore from '../store/usePostStore';
import { toast } from 'sonner';

/**
 * Hook to fetch all posts for the feed
 */
export const usePostsFeed = () => {
  const setPosts = usePostStore((state) => state.setPosts);

  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const data = await postService.getPosts();
      setPosts(data);
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
    onError: (error) => {
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    },
  });
};

/**
 * Hook to fetch user's own posts
 */
export const useMyPosts = () => {
  const setMyPosts = usePostStore((state) => state.setMyPosts);

  return useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const data = await postService.getMyPosts();
      setMyPosts(data);
      return data;
    },
    staleTime: 30 * 1000,
    onError: (error) => {
      toast.error('Failed to load your posts');
      console.error('Error fetching my posts:', error);
    },
  });
};

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const addPost = usePostStore((state) => state.addPost);

  return useMutation({
    mutationFn: postService.createPost,
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['posts']);

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update with temporary post
      const tempPost = {
        id: `temp-${Date.now()}`,
        body: newPost.body,
        author: {
          name: 'You',
          // Will be replaced with actual user data
        },
        createdAt: new Date().toISOString(),
        likes: { count: 0, isLiked: false, users: [] },
        comments: { count: 0 },
        images: newPost.images?.map((img) => URL.createObjectURL(img)) || [],
        isOptimistic: true,
      };

      addPost(tempPost);

      return { previousPosts, tempPost };
    },
    onSuccess: (data, variables, context) => {
      toast.success('Post created successfully!');
      // Invalidate and refetch
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['myPosts']);
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    },
  });
};

/**
 * Hook to like/unlike a post
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();
  const toggleLike = usePostStore((state) => state.toggleLike);

  return useMutation({
    mutationFn: postService.likePost,
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['posts']);

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update
      // Note: We need userId from auth store
      toggleLike(postId, 'current-user-id'); // TODO: Get actual user ID

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error('Failed to update like');
      console.error('Error liking post:', error);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries(['posts']);
    },
  });
};

/**
 * Hook to comment on a post
 */
export const useCommentPost = () => {
  const queryClient = useQueryClient();
  const addComment = usePostStore((state) => state.addComment);

  return useMutation({
    mutationFn: ({ postId, comment }) =>
      postService.commentOnPost(postId, comment),
    onMutate: async ({ postId, comment }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['posts']);

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update comment count
      addComment(postId, comment);

      return { previousPosts };
    },
    onSuccess: (data, variables) => {
      toast.success('Comment added!');
      // Invalidate comments for this post
      queryClient.invalidateQueries(['postComments', variables.postId]);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error('Failed to add comment');
      console.error('Error commenting on post:', error);
    },
  });
};

/**
 * Hook to fetch comments for a specific post
 */
export const usePostComments = (postId) => {
  return useQuery({
    queryKey: ['postComments', postId],
    queryFn: () => postService.getPostComments(postId),
    enabled: !!postId, // Only run if postId is provided
    staleTime: 30 * 1000,
    onError: (error) => {
      toast.error('Failed to load comments');
      console.error('Error fetching comments:', error);
    },
  });
};
