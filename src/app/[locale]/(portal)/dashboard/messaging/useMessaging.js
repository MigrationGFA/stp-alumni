import { useState, useCallback, useMemo } from "react";

export function generateId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}


// Mock data - will be replaced with backend calls
const createMockConversations = () => [
  {
    id: "1",
    name: "Bayu Saito",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "I would like to get more information on the...",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: true,
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    name: "Oreoluwa Sade",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "Thanks Emmanuel",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: false,
    unreadCount: 0,
    online: false,
  },
  {
    id: "3",
    name: "James Bond",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    lastMessage: "Hello good morning",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    unread: false,
    unreadCount: 0,
    online: true,
  },
  {
    id: "4",
    name: "Bisola Adura",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "I would love to get to know you better...",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unread: true,
    unreadCount: 1,
    online: false,
  },
  {
    id: "5",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastMessage: "Let's schedule a call for tomorrow",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: false,
    unreadCount: 0,
    online: true,
  },
  {
    id: "6",
    name: "Sarah Williams",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    lastMessage: "The project looks great!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unread: false,
    unreadCount: 0,
    online: false,
  },
];

const createMockMessages = () => ({
  "1": [
    {
      id: "m1",
      conversationId: "1",
      senderId: "1",
      content: "Hi Oreoluwa, it's great to connect with you. Looking forward to staying in touch.",
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      isOwn: false,
      status: "read",
    },
    {
      id: "m2",
      conversationId: "1",
      senderId: "me",
      content: "Awesome! Can I see a couple of pictures?",
      createdAt: new Date(Date.now() - 1000 * 60 * 8),
      isOwn: true,
      status: "read",
    },
    {
      id: "m3",
      conversationId: "1",
      senderId: "1",
      content: "I would like to get more information on the project you mentioned. Could you share more details?",
      createdAt: new Date(Date.now() - 1000 * 60 * 2),
      isOwn: false,
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m4",
      conversationId: "2",
      senderId: "2",
      content: "Thanks Emmanuel! I really appreciate your help with the project.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isOwn: false,
      status: "read",
    },
  ],
  "3": [
    {
      id: "m5",
      conversationId: "3",
      senderId: "3",
      content: "Hello good morning! How are you doing today?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: false,
      status: "read",
    },
  ],
  "4": [
    {
      id: "m6",
      conversationId: "4",
      senderId: "4",
      content: "I would love to get to know you better. Are you free for a coffee sometime?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isOwn: false,
      status: "delivered",
    },
  ],
});

export function useMessaging() {
  const [conversations, setConversations] = useState(createMockConversations);
  const [messages, setMessages] = useState(createMockMessages);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading] = useState(false);

  // Sort and filter conversations
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (conv) =>
          conv.name.toLowerCase().includes(query) ||
          conv.lastMessage.toLowerCase().includes(query)
      );
    }

    // Sort conversations
    result.sort((a, b) => {
      switch (sortBy) {
        case "unread":
          // Unread first, then by recent
          if (a.unread !== b.unread) return a.unread ? -1 : 1;
          return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
        default:
          return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
      }
    });

    return result;
  }, [conversations, searchQuery, sortBy]);

  // Get selected conversation
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  // Get messages for selected conversation (sorted by time)
  const currentMessages = useMemo(() => {
    if (!selectedConversationId) return [];
    const convMessages = messages[selectedConversationId] || [];
    return [...convMessages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }, [messages, selectedConversationId]);

  // Select conversation and mark as read
  const selectConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId);
    
    if (conversationId) {
      // Mark conversation as read (optimistic update)
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, unread: false, unreadCount: 0 }
            : conv
        )
      );

      // Mark messages as read
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((msg) =>
          !msg.isOwn ? { ...msg, status: "read"  } : msg
        ),
      }));

      // TODO: Backend call to mark as read
      // await markConversationAsRead(conversationId);
    }
  }, []);

  // Send a message with optimistic update
  const sendMessage = useCallback(
    (content) => {
      if (!selectedConversationId || !content.trim()) return;

      const tempId = generateId();
      const now = new Date();

      const newMessage = {
        id: tempId,
        conversationId: selectedConversationId,
        senderId: "me",
        content: content.trim(),
        createdAt: now,
        isOwn: true,
        status: "sending",
      };

      // Optimistic update - add message immediately
      setMessages((prev) => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
      }));

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId
            ? {
                ...conv,
                lastMessage: content.trim(),
                lastMessageAt: now,
              }
            : conv
        )
      );

      // Simulate sending (will be replaced with backend call)
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedConversationId]: (prev[selectedConversationId] || []).map((msg) =>
            msg.id === tempId ? { ...msg, status: "sent"  } : msg
          ),
        }));

        // Simulate delivery after a short delay
        setTimeout(() => {
          setMessages((prev) => ({
            ...prev,
            [selectedConversationId]: (prev[selectedConversationId] || []).map((msg) =>
              msg.id === tempId ? { ...msg, status: "delivered" } : msg
            ),
          }));
        }, 500);
      }, 300);

      // TODO: Backend call
      // const result = await sendMessageToBackend(selectedConversationId, content);
      // Update message status based on result
    },
    [selectedConversationId]
  );

  // Retry failed message
  const retryMessage = useCallback(
    (messageId) => {
      if (!selectedConversationId) return;

      setMessages((prev) => ({
        ...prev,
        [selectedConversationId]: (prev[selectedConversationId] || []).map((msg) =>
          msg.id === messageId ? { ...msg, status: "sending" } : msg
        ),
      }));

      // TODO: Retry backend call
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedConversationId]: (prev[selectedConversationId] || []).map((msg) =>
            msg.id === messageId ? { ...msg, status: "sent"  } : msg
          ),
        }));
      }, 500);
    },
    [selectedConversationId]
  );

  // Delete message
  const deleteMessage = useCallback(
    (messageId) => {
      if (!selectedConversationId) return;

      setMessages((prev) => ({
        ...prev,
        [selectedConversationId]: (prev[selectedConversationId] || []).filter(
          (msg) => msg.id !== messageId
        ),
      }));

      // TODO: Backend call to delete message
    },
    [selectedConversationId]
  );

  return {
    // State
    conversations: filteredConversations,
    selectedConversation,
    currentMessages,
    searchQuery,
    sortBy,
    isLoading,

    // Actions
    setSearchQuery,
    setSortBy,
    selectConversation,
    sendMessage,
    retryMessage,
    deleteMessage,
  };
}
