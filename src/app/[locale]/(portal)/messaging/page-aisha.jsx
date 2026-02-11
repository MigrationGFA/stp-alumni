"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Send, Paperclip, Mic, Smile, Image as ImageIcon, Sparkles, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/**
 * @typedef {Object} Message
 * @property {number} id
 * @property {string} text
 * @property {string} time
 * @property {boolean} isOwn
 */

/**
 * @typedef {Object} Conversation
 * @property {number} id
 * @property {string} name
 * @property {string} preview
 * @property {string} time
 * @property {string} date
 * @property {string} avatar
 * @property {boolean} unread
 */

/**
 * Messaging page - Direct messages and conversations
 * @returns {JSX.Element}
 */
export default function MessagingPage() {
  const t = useTranslations("Messaging");
  
  /** @type {Conversation[]} */
  const conversations = [
    {
      id: 1,
      name: "Bayu Salto",
      previewKey: "conversations.preview1",
      time: "Sept 11",
      date: "Sept 11",
      avatar: "/assets/Profile Image.jpg",
      unread: true,
    },
    {
      id: 2,
      name: "Oreoluwa Sade",
      previewKey: "conversations.preview2",
      time: "Aug 8",
      date: "Aug 8",
      avatar: "/assets/hero2.png",
      unread: false,
    },
    {
      id: 3,
      name: "James Bond",
      previewKey: "conversations.preview3",
      time: "Aug 8",
      date: "Aug 8",
      avatar: "/assets/hero1.png",
      unread: false,
    },
    {
      id: 4,
      name: "Bisola Adura",
      previewKey: "conversations.preview4",
      time: "Aug 8",
      date: "Aug 8",
      avatar: "/assets/hero3.png",
      unread: false,
    },
    {
      id: 5,
      name: "Oreoluwa Sade",
      previewKey: "conversations.preview2",
      time: "Aug 8",
      date: "Aug 8",
      avatar: "/assets/hero2.png",
      unread: false,
    },
    {
      id: 6,
      name: "James Bond",
      previewKey: "conversations.preview3",
      time: "Aug 8",
      date: "Aug 8",
      avatar: "/assets/hero1.png",
      unread: false,
    },
    {
      id: 7,
      name: "Bisola Adura",
      previewKey: "conversations.preview4",
      time: "Aug 8",
      date: "Aug 8",
      avatar: "/assets/hero3.png",
      unread: false,
    },
    {
      id: 8,
      name: "Sarah Johnson",
      previewKey: "conversations.preview5",
      time: "Aug 7",
      date: "Aug 7",
      avatar: "/assets/Profile Image.jpg",
      unread: false,
    },
    {
      id: 9,
      name: "Michael Chen",
      previewKey: "conversations.preview6",
      time: "Aug 6",
      date: "Aug 6",
      avatar: "/assets/hero1.png",
      unread: false,
    },
    {
      id: 10,
      name: "Emma Wilson",
      previewKey: "conversations.preview7",
      time: "Aug 5",
      date: "Aug 5",
      avatar: "/assets/hero2.png",
      unread: false,
    },
    {
      id: 11,
      name: "David Brown",
      previewKey: "conversations.preview8",
      time: "Aug 4",
      date: "Aug 4",
      avatar: "/assets/hero3.png",
      unread: false,
    },
    {
      id: 12,
      name: "Lisa Anderson",
      previewKey: "conversations.preview9",
      time: "Aug 3",
      date: "Aug 3",
      avatar: "/assets/Profile Image.jpg",
      unread: false,
    },
    {
      id: 13,
      name: "Robert Taylor",
      previewKey: "conversations.preview10",
      time: "Aug 2",
      date: "Aug 2",
      avatar: "/assets/hero1.png",
      unread: false,
    },
    {
      id: 14,
      name: "Maria Garcia",
      previewKey: "conversations.preview11",
      time: "Aug 1",
      date: "Aug 1",
      avatar: "/assets/hero2.png",
      unread: false,
    },
    {
      id: 15,
      name: "John Smith",
      previewKey: "conversations.preview12",
      time: "Jul 31",
      date: "Jul 31",
      avatar: "/assets/hero3.png",
      unread: false,
    },
    {
      id: 16,
      name: "Jennifer Lee",
      previewKey: "conversations.preview13",
      time: "Jul 30",
      date: "Jul 30",
      avatar: "/assets/Profile Image.jpg",
      unread: false,
    },
  ];

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");
  const [showChatView, setShowChatView] = useState(false);

  /** @type {Message[]} */
  const [messages, setMessages] = useState([
    {
      id: 1,
      textKey: "messages.message1",
      time: "4:56 pm",
      isOwn: false,
    },
    {
      id: 2,
      textKey: "messages.message2",
      time: "4:56 pm",
      isOwn: true,
    },
    {
      id: 3,
      textKey: "messages.message1",
      time: "4:56 pm",
      isOwn: false,
    },
  ]);

  /**
   * Get current time in 12-hour format
   * @returns {string}
   */
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  /**
   * Handle sending a message
   */
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageText.trim(),
      time: getCurrentTime(),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  /**
   * Handle Enter key press in textarea
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handle conversation click - on mobile, show chat view
   * @param {Conversation} conversation
   */
  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    // On mobile, show chat view when conversation is clicked
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowChatView(true);
    }
  };
  
  return (
    <div className="">
      {/* Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light mb-6">{t("title")}</h1>
      
      <div className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col lg:flex-row gap-4">
        {/* Conversations List - Hidden on mobile when chat view is shown */}
        <div className={`w-full lg:w-[380px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${showChatView ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
          {/* Header */}
          <div className="p-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Input
                placeholder={t("searchPlaceholder")}
                className="w-full h-12 rounded-3xl bg-gray-50 border-[#2B7FFF] focus:bg-white focus:border-[#2B7FFF]"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation.id === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={conv.avatar} alt={conv.name} />
                  <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-blue-600 shrink-0">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {t(conv.previewKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area - Hidden on mobile when conversations list is shown, visible on desktop */}
        <div className={`flex-1 flex flex-col gap-4 min-h-0 ${showChatView ? '' : 'hidden lg:flex'}`}>
        {/* Chat Header */}
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            {/* Back button - only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChatView(false)}
              className="lg:hidden mr-2"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
              <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
              <p className="text-xs text-green-600">{t("available")}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto p-4 lg:p-6 space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] lg:max-w-[50%] ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
                {!message.isOwn && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl flex flex-col ${
                    message.isOwn
                      ? "bg-[#2B7FFF] text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed mb-1">{message.textKey ? t(message.textKey) : message.text}</p>
                  <p className={`text-xs text-right ${message.isOwn ? "text-white/80" : "text-gray-500"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          {/* Text Input */}
          <div className="mb-3">
            <textarea
              placeholder={t("typeMessage")}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border-0 rounded-lg resize-none focus:outline-none focus:ring-0 bg-transparent"
              rows={3}
              style={{ 
                maxHeight: '4.5rem',
                overflowY: 'auto',
                lineHeight: '1.5rem'
              }}
            />
          </div>
          
          {/* Horizontal Line */}
          <div className="border-t border-[#2B7FFF66] mb-3"></div>
          
          {/* Icons Row */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-700">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-700">
              <Mic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-700">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-700">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-700">
              <Sparkles className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              disabled={!messageText.trim()}
              onClick={handleSendMessage}
              className={`h-10 w-10 rounded-full ml-auto ${
                messageText.trim()
                  ? "bg-[#2B7FFF] hover:bg-[#2370E8] text-white"
                  : "bg-[#2B7FFF66] hover:bg-[#2B7FFF80] text-white cursor-not-allowed"
              }`}
            >
              <Send className={`h-4 w-4 ${messageText.trim() ? "text-white fill-white" : "text-white fill-white opacity-60"}`} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

