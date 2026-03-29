import { useState, useCallback, useMemo } from "react";
import {
  useConversations,
  useMessages,
  useSendMedia,
  useDeleteMessage,
  usePendingInvitations,
  useRespondToInvitation,
  useSendInvitation,
} from "@/lib/hooks/useMessagingQueries";
import useMessagingStore from "@/lib/store/useMessagingStore";
import useAuthStore from "@/lib/store/useAuthStore";

/** Stable empty array to avoid infinite re-render loops in Zustand selectors */
const EMPTY_ARRAY = [];

/**
 * Generate a temporary ID for optimistic updates.
 */
export function generateId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Normalize a conversation from the API shape to the shape our UI components expect.
 * Handles both DIRECT and PUBLIC_GROUP types for the messaging page.
 */
function normalizeConversation(conv, currentUserId) {
  const id = conv.conversationId || conv.id;
  const type = conv.type || "DIRECT";

  // For direct chats, derive name/avatar from the other participant
  let name = conv.name || conv.title || "Unnamed";
  let avatar = conv.avatar || conv.thumbnail || null;

  if (type === "DIRECT" && Array.isArray(conv.participants)) {
    const other = conv.participants.find((p) => p.userId !== currentUserId);
    if (other) {
      name = other.name || other.firstName || name;
      avatar = other.profileImagePath || other.avatar || avatar;
    }
  }

  return {
    id,
    conversationId: id,
    type,
    name,
    avatar,
    lastMessage: conv.lastMessage || conv.lastMessageContent || "",
    lastMessageAt: conv.lastMessageAt || conv.updatedAt
      ? new Date(conv.lastMessageAt || conv.updatedAt)
      : new Date(),
    unread: !!conv.unreadCount || conv.unread || false,
    unreadCount: parseInt(conv.unreadCount, 10) || 0,
    online: conv.online || false,
    participants: conv.participants || [],
    isOpen: conv.isOpen,
    description: conv.description,
  };
}

/**
 * Normalize a message from the API shape to the shape our UI components expect.
 */
function normalizeMessage(msg, currentUserId) {
  const senderId = msg.senderId || msg.userId;
  const isOwn = senderId === currentUserId;

  return {
    id: msg.messageId || msg.id,
    messageId: msg.messageId || msg.id,
    conversationId: msg.conversationId,
    senderId,
    senderName: msg.senderName || msg.name || (isOwn ? "You" : "User"),
    senderAvatar: msg.senderAvatar || msg.profileImagePath || null,
    content: msg.content || msg.message || "",
    mediaUrl: msg.mediaUrl || null,
    mediaType: msg.mediaType || null,
    createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
    isOwn,
    status: msg.status || (isOwn ? "sent" : "read"),
  };
}

/**
 * Main messaging hook — replaces the old mock-based hook.
 * Fetches real data from the API via React Query and exposes the same
 * interface that page.jsx and the UI components expect.
 */
export function useMessaging() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const currentUser = useAuthStore((s) => s.user);
  const currentUserId = currentUser?.id || currentUser?.userId;

  // ─── API Queries ─────────────────────────────────────────────
  const { data: rawConversations, isLoading: convsLoading } = useConversations();
  const { data: rawMessagesData, isLoading: msgsLoading } = useMessages(selectedConversationId);
  const { data: invitations, isLoading: invLoading } = usePendingInvitations();

  // ─── API Mutations ───────────────────────────────────────────
  const { mutate: sendMediaMutation } = useSendMedia();
  const { mutate: deleteMessageMutation } = useDeleteMessage();
  const { mutate: respondToInvitationMutation } = useRespondToInvitation();
  const { mutate: sendInvitationMutation } = useSendInvitation();

  // ─── Normalize conversations ─────────────────────────────────
  const allConversations = useMemo(() => {
    if (!rawConversations) return [];
    const list = Array.isArray(rawConversations) ? rawConversations : [];
    return list.map((c) => normalizeConversation(c, currentUserId));
  }, [rawConversations, currentUserId]);

  // Filter to DIRECT and PUBLIC_GROUP for the messaging page
  // (PRIVATE_GROUP is handled by the Deal Room page)
  const messagingConversations = useMemo(() => {
    return allConversations.filter(
      (c) => c.type === "DIRECT" || c.type === "PUBLIC_GROUP"
    );
  }, [allConversations]);

  // ─── Sort & filter ───────────────────────────────────────────
  const filteredConversations = useMemo(() => {
    let result = [...messagingConversations];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (conv) =>
          conv.name.toLowerCase().includes(query) ||
          (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "unread":
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
  }, [messagingConversations, searchQuery, sortBy]);

  // ─── Selected conversation ───────────────────────────────────
  const selectedConversation = useMemo(
    () => messagingConversations.find((c) => c.id === selectedConversationId) || null,
    [messagingConversations, selectedConversationId]
  );

  // ─── Normalize messages ──────────────────────────────────────
  const currentMessages = useMemo(() => {
    if (!selectedConversationId || !rawMessagesData) return [];
    const raw = Array.isArray(rawMessagesData?.data)
      ? rawMessagesData.data
      : Array.isArray(rawMessagesData)
        ? rawMessagesData
        : [];
    return raw
      .map((m) => normalizeMessage(m, currentUserId))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [rawMessagesData, selectedConversationId, currentUserId]);

  // Also include any optimistic messages from the store
  const allStoreMessages = useMessagingStore((s) => s.messages);
  const storeMessages = selectedConversationId
    ? allStoreMessages[selectedConversationId] || EMPTY_ARRAY
    : EMPTY_ARRAY;

  const mergedMessages = useMemo(() => {
    // Combine API messages with optimistic store messages (temp IDs)
    const apiIds = new Set(currentMessages.map((m) => m.id));
    const optimistic = storeMessages.filter((m) => !apiIds.has(m.id));
    return [...currentMessages, ...optimistic].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [currentMessages, storeMessages]);

  // ─── Actions ─────────────────────────────────────────────────

  const selectConversation = useCallback((conversationId) => {
    setSelectedConversationId(conversationId);
    if (conversationId) {
      useMessagingStore.getState().setActiveConversation(conversationId);
    }
  }, []);

  const sendMessage = useCallback(
    (content) => {
      if (!selectedConversationId || !content.trim()) return;

      const tempId = generateId();
      const now = new Date();

      const optimisticMessage = {
        id: tempId,
        messageId: tempId,
        conversationId: selectedConversationId,
        senderId: currentUserId,
        senderName: currentUser?.name || "You",
        content: content.trim(),
        createdAt: now,
        isOwn: true,
        status: "sending",
      };

      const formData = new FormData();
      formData.append("content", content.trim());

      sendMediaMutation({
        conversationId: selectedConversationId,
        formData,
        optimisticMessage,
      });
    },
    [selectedConversationId, currentUserId, currentUser, sendMediaMutation]
  );

  const sendMediaFile = useCallback(
    (file, caption = "") => {
      if (!selectedConversationId || !file) return;

      const tempId = generateId();
      const now = new Date();

      const optimisticMessage = {
        id: tempId,
        messageId: tempId,
        conversationId: selectedConversationId,
        senderId: currentUserId,
        senderName: currentUser?.name || "You",
        content: caption || file.name,
        mediaUrl: URL.createObjectURL(file),
        mediaType: file.type.startsWith("image/") ? "image" : "document",
        createdAt: now,
        isOwn: true,
        status: "sending",
      };

      const formData = new FormData();
      formData.append("mediaFile", file);
      if (caption) formData.append("content", caption);

      sendMediaMutation({
        conversationId: selectedConversationId,
        formData,
        optimisticMessage,
      });
    },
    [selectedConversationId, currentUserId, currentUser, sendMediaMutation]
  );

  const retryMessage = useCallback(
    (messageId) => {
      if (!selectedConversationId) return;
      // Find the failed message in the store and resend
      const msgs = useMessagingStore.getState().messages[selectedConversationId] || [];
      const failedMsg = msgs.find((m) => m.id === messageId);
      if (!failedMsg) return;

      useMessagingStore.getState().updateMessage(selectedConversationId, messageId, {
        status: "sending",
      });

      const formData = new FormData();
      formData.append("content", failedMsg.content);

      sendMediaMutation({
        conversationId: selectedConversationId,
        formData,
        optimisticMessage: null, // Already in store
      });
    },
    [selectedConversationId, sendMediaMutation]
  );

  const deleteMessage = useCallback(
    (messageId) => {
      if (!selectedConversationId) return;
      deleteMessageMutation({
        conversationId: selectedConversationId,
        messageId,
      });
    },
    [selectedConversationId, deleteMessageMutation]
  );

  // ─── Invitation actions ──────────────────────────────────────

  const acceptInvitation = useCallback(
    (invitationId) => {
      respondToInvitationMutation({ invitationId, action: "accept" });
    },
    [respondToInvitationMutation]
  );

  const declineInvitation = useCallback(
    (invitationId) => {
      respondToInvitationMutation({ invitationId, action: "decline" });
    },
    [respondToInvitationMutation]
  );

  const inviteUser = useCallback(
    (recipientId, shortMessage = "Hi, I'd like to connect with you!") => {
      sendInvitationMutation({ recipientId, shortMessage });
    },
    [sendInvitationMutation]
  );

  return {
    // State
    conversations: filteredConversations,
    selectedConversation,
    currentMessages: mergedMessages,
    searchQuery,
    sortBy,
    isLoading: convsLoading,
    isMessagesLoading: msgsLoading,
    invitations: invitations || [],
    isInvitationsLoading: invLoading,

    // Actions
    setSearchQuery,
    setSortBy,
    selectConversation,
    sendMessage,
    sendMediaFile,
    retryMessage,
    deleteMessage,

    // Invitation actions
    acceptInvitation,
    declineInvitation,
    inviteUser,
  };
}
