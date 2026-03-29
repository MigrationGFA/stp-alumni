import { create } from 'zustand';

const useMessagingStore = create((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────
  conversations: [],
  activeConversationId: null,
  messages: {}, // { [conversationId]: Message[] }
  invitations: [],
  isLoading: false,
  error: null,

  // ─── Selectors (call as getters) ──────────────────────────────

  /** All DIRECT conversations */
  getDirectConversations: () =>
    get().conversations.filter((c) => c.type === 'DIRECT'),

  /** All PUBLIC_GROUP conversations */
  getPublicGroupConversations: () =>
    get().conversations.filter((c) => c.type === 'PUBLIC_GROUP'),

  /** All PRIVATE_GROUP (deal room) conversations */
  getPrivateGroupConversations: () =>
    get().conversations.filter((c) => c.type === 'PRIVATE_GROUP'),

  /** Messages for the currently active conversation, sorted by time */
  getActiveMessages: () => {
    const { activeConversationId, messages } = get();
    if (!activeConversationId) return [];
    const msgs = messages[activeConversationId] || [];
    return [...msgs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  /** The active conversation object */
  getActiveConversation: () => {
    const { activeConversationId, conversations } = get();
    return conversations.find((c) => c.conversationId === activeConversationId) || null;
  },

  // ─── Actions ───────────────────────────────────────────────────

  setConversations: (data) => set({ conversations: data }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setMessages: (conversationId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: msgs },
    })),

  /** Append a single message to a conversation (optimistic send) */
  appendMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

  /** Update a specific message in a conversation (e.g. status change) */
  updateMessage: (conversationId, messageId, partial) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) =>
          msg.messageId === messageId || msg.id === messageId
            ? { ...msg, ...partial }
            : msg
        ),
      },
    })),

  /** Remove a message from a conversation */
  removeMessage: (conversationId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).filter(
          (msg) => msg.messageId !== messageId && msg.id !== messageId
        ),
      },
    })),

  setInvitations: (data) => set({ invitations: data }),

  /** Update a conversation in place (e.g. lastMessage, unread count) */
  updateConversation: (conversationId, partial) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.conversationId === conversationId ? { ...c, ...partial } : c
      ),
    })),

  /** Add a new conversation to the top of the list */
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  /** Remove a conversation entirely */
  removeConversation: (conversationId) =>
    set((state) => {
      const newMessages = { ...state.messages };
      delete newMessages[conversationId];
      return {
        conversations: state.conversations.filter(
          (c) => c.conversationId !== conversationId
        ),
        messages: newMessages,
        activeConversationId:
          state.activeConversationId === conversationId
            ? null
            : state.activeConversationId,
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  /** Reset the entire store (e.g. on logout) */
  reset: () =>
    set({
      conversations: [],
      activeConversationId: null,
      messages: {},
      invitations: [],
      isLoading: false,
      error: null,
    }),
}));

export default useMessagingStore;
