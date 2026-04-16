import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Send,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { formatMessageDate, groupMessagesByDate } from "@/lib/helper";
import { toast } from "sonner";
import { ModernScrollArea } from "@/components/shared/ScrollArea";
import { useRouter } from "@/i18n/routing";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 20 * 1024 * 1024; // 20MB

export function ChatView({
  conversation,
  messages,
  onBack,
  onSendMessage,
  onSendMediaFile,
  onRetryMessage,
  onDeleteMessage,
  onOpenGroupSettings,
  isLoading,
}) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const router = useRouter();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP, and GIF images are allowed");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be under 5MB");
      return;
    }
    onSendMediaFile?.(file);
    e.target.value = "";
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (![...IMAGE_TYPES, ...DOC_TYPES].includes(file.type)) {
      toast.error("Unsupported file type");
      return;
    }
    const maxSize = IMAGE_TYPES.includes(file.type)
      ? MAX_IMAGE_SIZE
      : MAX_DOC_SIZE;
    if (file.size > maxSize) {
      toast.error(
        `File must be under ${maxSize === MAX_IMAGE_SIZE ? "5MB" : "20MB"}`,
      );
      return;
    }
    onSendMediaFile?.(file);
    e.target.value = "";
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);
  // console.log(messageGroups,"messageGroups")

  return (
    <div className="flex flex-col justify-between bg-background overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold text-foreground">
              {conversation.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {conversation.online ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Available
                </>
              ) : conversation.type === "PUBLIC_GROUP" ? (
                `${conversation.participants || 0} members`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {conversation.type !== "PUBLIC_GROUP" && (
              <>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/profile/${conversation.userId}`)
                }
                >
                View profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
                </>
            )}
            {/* <DropdownMenuItem>Search in conversation</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Mute notifications</DropdownMenuItem> */}
            {conversation.type === "PUBLIC_GROUP" && onOpenGroupSettings && (
              <>
                <DropdownMenuItem onClick={onOpenGroupSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Group Settings
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ModernScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-6 max-w-3xl">
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stp-blue-light" />
            </div>
          )}

          {!isLoading &&
            Array.from(messageGroups.entries()).map(
              ([dateKey, dateMessages]) => (
                <div key={dateKey}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-muted px-3 py-1 rounded-full">
                      <span className="text-xs text-muted-foreground">
                        {formatMessageDate(new Date(dateKey))}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {dateMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        senderAvatar={
                          message.senderAvatar || conversation.avatar
                        }
                        senderName={message.senderName || conversation.name}
                        onRetry={() => onRetryMessage(message.id)}
                        onDelete={() => onDeleteMessage(message.id)}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}

          {!isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          )}
        </div>
      </ModernScrollArea>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
      />

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-muted/50 rounded-2xl px-4 py-2">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-1 min-h-[24px] max-h-[120px] resize-none"
              rows={1}
            />
            <div className="flex items-center gap-1 flex-shrink-0 pb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all",
                  newMessage.trim()
                    ? "bg-stp-blue-light hover:bg-stp-blue-light/90"
                    : "bg-stp-blue-light/50 cursor-not-allowed",
                )}
                onClick={handleSend}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
