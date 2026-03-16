import { create } from 'zustand';

const usePostStore = create((set) => ({
  posts: [],
  myPosts: [],
  isLoading: false,
  error: null,

  // Set all posts
  setPosts: (posts) => set({ posts }),

  // Set user's posts
  setMyPosts: (myPosts) => set({ myPosts }),

  // Add a new post (optimistic update)
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  // Update a post after server response
  updatePost: (postId, updatedData) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...updatedData } : post
      ),
    })),

  // Remove a post
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),

  // Toggle like on a post (optimistic)
  toggleLike: (postId, userId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes?.users?.some((user) => user.id === userId);
          return {
            ...post,
            likes: {
              count: isLiked ? post.likes.count - 1 : post.likes.count + 1,
              isLiked: !isLiked,
              users: isLiked
                ? post.likes.users.filter((user) => user.id !== userId)
                : [...(post.likes.users || []), { id: userId }],
            },
          };
        }
        return post;
      }),
    })),

  // Add a comment (optimistic)
  addComment: (postId, comment) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: {
              count: (post.comments?.count || 0) + 1,
            },
          };
        }
        return post;
      }),
    })),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default usePostStore;
