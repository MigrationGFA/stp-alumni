import { useState, useCallback, useMemo } from "react";

export function generateId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}


// Mock members - will be replaced with backend
const createMockMembers = (roomId) => {
  const byRoom = {
    "1": [
      { id: "mem1", name: "Oreoluwa Sade" },
      { id: "mem2", name: "Bayu Saito" },
    ],
    "2": [{ id: "mem3", name: "Oreoluwa Sade" }],
    "3": [{ id: "mem4", name: "James Bond" }],
  };
  return byRoom[roomId] || [{ id: "mem0", name: "Oreoluwa Sade" }];
};

// Mock data - will be replaced with backend calls
const createMockRooms = () => [
  {
    id: "1",
    name: "STP Project",
    avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop",
    lastMessage: "Bayu: I want to get more information on the...",
    lastMessageAt: new Date(2026, 8, 11), // Sept 11
    unread: false,
    unreadCount: 0,
    online: false,
    onlineCount: 2,
    members: createMockMembers("1"),
  },
  {
    id: "2",
    name: "AI training",
    avatar: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=100&h=100&fit=crop",
    lastMessage: "Oreoluwa: Thanks Emmanuel",
    lastMessageAt: new Date(2026, 7, 8), // Aug 8
    unread: false,
    unreadCount: 0,
    online: false,
    onlineCount: 1,
    members: createMockMembers("2"),
  },
  {
    id: "3",
    name: "Real Estate Training",
    avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
    lastMessage: "James: Hello good morning",
    lastMessageAt: new Date(2026, 7, 6), // Aug 6
    unread: false,
    unreadCount: 0,
    online: false,
    onlineCount: 1,
    members: createMockMembers("3"),
  },
  {
    id: "4",
    name: "AI training",
    avatar: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=100&h=100&fit=crop",
    lastMessage: "Oreoluwa: Thanks Emmanuel",
    lastMessageAt: new Date(2026, 7, 8), // Aug 8
    unread: false,
    unreadCount: 0,
    online: false,
    onlineCount: 1,
    members: createMockMembers("2"),
  },
  {
    id: "5",
    name: "STP Project",
    avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop",
    lastMessage: "Bayu: I want to get more information on the...",
    lastMessageAt: new Date(2026, 8, 11), // Sept 11
    unread: false,
    unreadCount: 0,
    online: false,
    onlineCount: 2,
    members: createMockMembers("1"),
  },
  {
    id: "6",
    name: "Real Estate Training",
    avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
    lastMessage: "James: Hello good morning",
    lastMessageAt: new Date(2026, 7, 6), // Aug 6
    unread: false,
    unreadCount: 0,
    online: false,
    onlineCount: 1,
    members: createMockMembers("3"),
  },
];

const createMockMessages = () => ({
  "1": [
    {
      id: "m1",
      roomId: "1",
      senderId: "1",
      senderName: "Bayu Saito",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "Hi everyone, it's great to connect with you all. Looking forward to working on this project together.",
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      isOwn: false,
      status: "read",
    },
    {
      id: "m2",
      roomId: "1",
      senderId: "me",
      senderName: "You",
      content: "Awesome! Can I see the project details?",
      createdAt: new Date(Date.now() - 1000 * 60 * 8),
      isOwn: true,
      status: "read",
    },
    {
      id: "m3",
      roomId: "1",
      senderId: "1",
      senderName: "Bayu Saito",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "I would like to get more information on the project you mentioned. Could you share more details?",
      createdAt: new Date(Date.now() - 1000 * 60 * 2),
      isOwn: false,
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m4",
      roomId: "2",
      senderId: "2",
      senderName: "Oreoluwa Sade",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "Thanks Emmanuel! I really appreciate your help with the AI training.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isOwn: false,
      status: "read",
    },
  ],
  "3": [
    {
      id: "m5",
      roomId: "3",
      senderId: "3",
      senderName: "James Bond",
      senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "Hello good morning! How is everyone doing today?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: false,
      status: "read",
    },
  ],
});

export function useDealRoom() {
  const [rooms, setRooms] = useState(createMockRooms);
  const [messages, setMessages] = useState(createMockMessages);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading] = useState(false);

  // Sort and filter rooms
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(query) ||
          room.lastMessage.toLowerCase().includes(query)
      );
    }

    // Sort rooms
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
  }, [rooms, searchQuery, sortBy]);

  // Get selected room
  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) || null,
    [rooms, selectedRoomId]
  );

  // Get messages for selected room (sorted by time)
  const currentMessages = useMemo(() => {
    if (!selectedRoomId) return [];
    const roomMessages = messages[selectedRoomId] || [];
    return [...roomMessages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }, [messages, selectedRoomId]);

  // Select room and mark as read
  const selectRoom = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    
    if (roomId) {
      // Mark room as read (optimistic update)
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? { ...room, unread: false, unreadCount: 0 }
            : room
        )
      );

      // Mark messages as read
      setMessages((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || []).map((msg) =>
          !msg.isOwn ? { ...msg, status: "read"  } : msg
        ),
      }));

      // TODO: Backend call to mark as read
      // await markRoomAsRead(roomId);
    }
  }, []);

  // Send a message with optimistic update
  const sendMessage = useCallback(
    (content) => {
      if (!selectedRoomId || !content.trim()) return;

      const tempId = generateId();
      const now = new Date();

      const newMessage = {
        id: tempId,
        roomId: selectedRoomId,
        senderId: "me",
        senderName: "You",
        content: content.trim(),
        createdAt: now,
        isOwn: true,
        status: "sending",
      };

      // Optimistic update - add message immediately
      setMessages((prev) => ({
        ...prev,
        [selectedRoomId]: [...(prev[selectedRoomId] || []), newMessage],
      }));

      // Update room's last message
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoomId
            ? {
                ...room,
                lastMessage: `You: ${content.trim()}`,
                lastMessageAt: now,
              }
            : room
        )
      );

      // Simulate sending (will be replaced with backend call)
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedRoomId]: (prev[selectedRoomId] || []).map((msg) =>
            msg.id === tempId ? { ...msg, status: "sent"  } : msg
          ),
        }));

        // Simulate delivery after a short delay
        setTimeout(() => {
          setMessages((prev) => ({
            ...prev,
            [selectedRoomId]: (prev[selectedRoomId] || []).map((msg) =>
              msg.id === tempId ? { ...msg, status: "delivered" } : msg
            ),
          }));
        }, 500);
      }, 300);

      // TODO: Backend call
      // const result = await sendMessageToBackend(selectedRoomId, content);
      // Update message status based on result
    },
    [selectedRoomId]
  );

  // Retry failed message
  const retryMessage = useCallback(
    (messageId) => {
      if (!selectedRoomId) return;

      setMessages((prev) => ({
        ...prev,
        [selectedRoomId]: (prev[selectedRoomId] || []).map((msg) =>
          msg.id === messageId ? { ...msg, status: "sending" } : msg
        ),
      }));

      // TODO: Retry backend call
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedRoomId]: (prev[selectedRoomId] || []).map((msg) =>
            msg.id === messageId ? { ...msg, status: "sent"  } : msg
          ),
        }));
      }, 500);
    },
    [selectedRoomId]
  );

  // Delete message
  const deleteMessage = useCallback(
    (messageId) => {
      if (!selectedRoomId) return;

      setMessages((prev) => ({
        ...prev,
        [selectedRoomId]: (prev[selectedRoomId] || []).filter(
          (msg) => msg.id !== messageId
        ),
      }));

      // TODO: Backend call to delete message
    },
    [selectedRoomId]
  );

  // Update room name
  const updateRoomName = useCallback((roomId, newName) => {
    if (!newName?.trim()) return;
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, name: newName.trim() } : room
      )
    );
    // TODO: Backend call
  }, []);

  // Delete deal room
  const deleteRoom = useCallback((roomId) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[roomId];
      return next;
    });
    if (selectedRoomId === roomId) setSelectedRoomId(null);
    // TODO: Backend call
  }, [selectedRoomId]);

  // Room members (add/remove) - updates room in place
  const addMember = useCallback((roomId, member) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const members = room.members || [];
        if (members.some((m) => m.id === member.id || m.name === member.name))
          return room;
        return { ...room, members: [...members, member] };
      })
    );
    // TODO: Backend call
  }, []);

  const removeMember = useCallback((roomId, memberId) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const members = (room.members || []).filter((m) => m.id !== memberId);
        return { ...room, members };
      })
    );
    // TODO: Backend call
  }, []);

  return {
    // State
    rooms: filteredRooms,
    selectedRoom,
    currentMessages,
    searchQuery,
    sortBy,
    isLoading,

    // Actions
    setSearchQuery,
    setSortBy,
    selectRoom,
    sendMessage,
    retryMessage,
    deleteMessage,
    updateRoomName,
    deleteRoom,
    addMember,
    removeMember,
  };
}
