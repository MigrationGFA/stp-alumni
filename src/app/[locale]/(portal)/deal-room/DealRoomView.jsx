import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreHorizontal, Smile, Paperclip, Image, Mic, Send, Pencil, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MessageBubble } from "../messaging/MessageBubble";
import { formatMessageDate, groupMessagesByDate } from "@/lib/helper";

export function DealRoomView({
  room,
  messages,
  onBack,
  onSendMessage,
  onRetryMessage,
  onDeleteMessage,
  onUpdateRoomName,
  onDeleteRoom,
  onAddMember,
  onRemoveMember,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [editNameValue, setEditNameValue] = useState(room.name);
  const [addMemberSearch, setAddMemberSearch] = useState("");
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const onlineCount = room.onlineCount ?? room.members?.length ?? 0;
  const members = room.members || [];

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

  const handleEditNameOpen = () => {
    setEditNameValue(room.name);
    setEditNameOpen(true);
  };

  const handleEditNameSubmit = () => {
    if (editNameValue.trim() && editNameValue.trim() !== room.name) {
      onUpdateRoomName?.(room.id, editNameValue.trim());
    }
    setEditNameOpen(false);
  };

  const handleAddMember = () => {
    if (addMemberSearch.trim()) {
      onAddMember?.(room.id, {
        id: `new_${Date.now()}`,
        name: addMemberSearch.trim(),
      });
      setAddMemberSearch("");
    }
  };

  const handleDeleteRoom = () => {
    onDeleteRoom?.(room.id);
    onBack?.();
  };

  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-background">
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
            <AvatarImage src={room.avatar} alt={room.name} />
            <AvatarFallback>
              {room.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold text-foreground">{room.name}</h2>
            <p className="text-sm text-primary">
              {onlineCount} member{onlineCount !== 1 ? "s" : ""} online
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Room options">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleEditNameOpen}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMembersOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              View members
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDeleteRoom}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete deal room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit room name modal */}
      <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit room name</DialogTitle>
            <DialogDescription>Update the name of the room</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              placeholder="Room name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditNameSubmit} className="bg-stp-blue-light text-white hover:bg-stp-blue-light/90">Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members modal */}
      <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Add new member</p>
              <div className="flex gap-2">
                <Input
                  value={addMemberSearch}
                  onChange={(e) => setAddMemberSearch(e.target.value)}
                  placeholder="Search for a user name"
                  className="flex-1"
                />
                <Button onClick={handleAddMember} className="bg-stp-blue-light text-white hover:bg-stp-blue-light/90">Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">List of member{members.length !== 1 ? "s" : ""}</p>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <span className="text-sm">{member.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onRemoveMember?.(room.id, member.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-6 max-w-3xl mx-auto">
          {Array.from(messageGroups.entries()).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              {/* Date separator */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-muted px-3 py-1 rounded-full">
                  <span className="text-xs text-muted-foreground">
                    {formatMessageDate(new Date(dateKey))}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {dateMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    senderAvatar={message.senderAvatar || room.avatar}
                    senderName={message.senderName || room.name}
                    onRetry={() => onRetryMessage(message.id)}
                    onDelete={() => onDeleteMessage(message.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>

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
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex">
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all",
                  newMessage.trim()
                    ? "bg-stp-blue-light hover:bg-stp-blue-light"
                    : "bg-stp-blue-light/50 cursor-not-allowed"
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
