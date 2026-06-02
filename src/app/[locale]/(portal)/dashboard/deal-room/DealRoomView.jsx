"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  Pencil,
  Users,
  Trash2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  X,
  Upload,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useSignNda } from "@/lib/hooks/useDealroomQueries";
import MembersModal from "./MembersModal";

// ─── NDA Full-Screen Overlay ─────────────────────────────────────────────────

function NDAOverlay({ room, currentUserId, onSign }) {
  const [agreed, setAgreed] = useState(false);
  const { mutateAsync: signNda, isPending } = useSignNda();

  const handleSign = async () => {
    if (!agreed || isPending) return;
    await signNda({ roomId: room.roomId || room.id });
    onSign?.();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header bar */}
          <div className="bg-amber-500 px-6 py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Confidentiality Agreement Required
              </p>
              <p className="text-white/80 text-xs mt-0.5">
                You must sign before accessing this deal room
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Room name */}
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                Deal Room:{" "}
                <span className="font-semibold text-foreground">
                  {room.roomName}
                </span>
              </p>
            </div>

            {/* Terms */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">
                By signing, you agree to:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Keep all information strictly confidential and not disclose it to any third party",
                  "Not copy, share, or distribute any documents shared in this room outside the platform",
                  "Use all communications solely for the purposes of this deal",
                  "Accept that unauthorized disclosure may result in legal consequences",
                ].map((term, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-0.5 h-4 w-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {term}
                  </li>
                ))}
              </ul>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className={cn(
                  "mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                  agreed
                    ? "bg-stp-blue-light border-stp-blue-light"
                    : "border-border group-hover:border-stp-blue-light/50"
                )}
                onClick={() => setAgreed((v) => !v)}
              >
                {agreed && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <span className="text-sm text-foreground leading-snug">
                I have read and fully understand this confidentiality agreement
                and agree to be legally bound by its terms.
              </span>
            </label>

            {/* CTA */}
            <Button
              className="w-full rounded-xl py-5 bg-stp-blue-light hover:bg-stp-blue-light/90 text-white font-semibold gap-2 disabled:opacity-50"
              disabled={!agreed || isPending}
              onClick={handleSign}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sign & Enter Deal Room
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your signature is timestamped and recorded in the audit log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator({ users }) {
  if (!users?.length) return null;
  const names = users.map((u) => u.name).join(", ");
  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-muted-foreground">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span>
        {names} {users.length === 1 ? "is" : "are"} typing…
      </span>
    </div>
  );
}


// ─── Documents Modal ─────────────────────────────────────────────────────────

function DocumentsModal({ open, onOpenChange, room, onUploadFile }) {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const documents = room?.documents || [];

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    await onUploadFile?.(file, (pct) => setUploadProgress(pct));
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </DialogTitle>
          <DialogDescription>
            Only NDA-signed members can view and upload documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Upload area */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-border px-4 py-3 hover:border-stp-blue-light/50 hover:bg-muted/30 transition-all group"
            disabled={uploadProgress !== null}
          >
            <div className="h-9 w-9 rounded-full bg-muted group-hover:bg-stp-blue-light/10 transition-colors flex items-center justify-center shrink-0">
              <Upload className="h-4 w-4 text-muted-foreground group-hover:text-stp-blue-light transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Upload a document</p>
              <p className="text-xs text-muted-foreground">Any file up to 50MB</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Progress */}
          {uploadProgress !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-stp-blue-light transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Document list */}
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">No documents yet.</p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {documents.map((doc) => (
                <li
                  key={doc.id || doc.fileId || doc.name}
                  className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div className="h-8 w-8 rounded-lg bg-stp-blue-light/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-stp-blue-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name || doc.fileName}</p>
                    {doc.streamUrl && (
                      <a
                        href={doc.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-stp-blue-light hover:underline"
                      >
                        View / Stream
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main DealRoomView ────────────────────────────────────────────────────────

export function DealRoomView({
  room,
  messages,
  currentUserId,
  typingUsers = [],
  onBack,
  onSendMessage,
  onSendTyping,
  onDeleteMessage,
  onAddMember,
  onRemoveMember,
  onUploadFile,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editNameValue, setEditNameValue] = useState(room?.roomName || "");
  const [membersOpen, setMembersOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [ndaSigned, setNdaSigned] = useState(room?.hasSignedNda ?? false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Sync NDA state when room detail loads/changes
  useEffect(() => {
    if (room?.hasSignedNda !== undefined) {
      setNdaSigned(room.hasSignedNda);
    }
  }, [room?.hasSignedNda, room?.roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [newMessage]);

  const handleSend = useCallback(() => {
    const text = newMessage.trim();
    if (!text) return;
    onSendMessage(text);
    setNewMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [newMessage, onSendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    // Debounced typing indicator
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onSendTyping?.();
    }, 300);
  };

  const handleFileAttach = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadFile?.(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const messageGroups = groupMessagesByDate(messages);
  const members = room?.members || [];

  return (
    <div className="relative flex flex-col h-full bg-background overflow-hidden">
      {/* ── NDA Overlay (blocks everything until signed) ── */}
      {!ndaSigned && room && (
        <NDAOverlay
          room={room}
          currentUserId={currentUserId}
          onSign={() => setNdaSigned(true)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar className="h-9 w-9">
            <AvatarImage src={room?.avatar} alt={room?.roomName} />
            <AvatarFallback className="text-xs font-semibold bg-stp-blue-light/10 text-stp-blue-light">
              {room?.roomName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-foreground truncate leading-tight">
              {room?.roomName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {room?.memberCount ?? members.length}{" "}
                {(room?.memberCount ?? members.length) === 1
                  ? "member"
                  : "members"}
              </span>
              {ndaSigned && (
                <>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                    NDA signed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                setEditNameValue(room?.roomName || "");
                setEditNameOpen(true);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMembersOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              Members
              {members.length > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {members.length}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDocumentsOpen(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Edit name dialog ── */}
      <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename room</DialogTitle>
          </DialogHeader>
          <Input
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
            placeholder="Room name"
            className="mt-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // hook into parent if needed
                setEditNameOpen(false);
              }
            }}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditNameOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-stp-blue-light text-white hover:bg-stp-blue-light/90 rounded-full"
              onClick={() => setEditNameOpen(false)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Members modal ── */}
      <MembersModal
        open={membersOpen}
        onOpenChange={setMembersOpen}
        room={room}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
      />

      {/* ── Documents modal ── */}
      <DocumentsModal
        open={documentsOpen}
        onOpenChange={setDocumentsOpen}
        room={room}
        onUploadFile={onUploadFile}
      />

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-4 space-y-6 max-w-3xl mx-auto pb-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Send className="h-5 w-5 opacity-40" />
              </div>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs mt-1 opacity-60">
                Start the conversation!
              </p>
            </div>
          ) : (
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
                  <div className="space-y-3">
                    {dateMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        senderAvatar={message.senderAvatar}
                        senderName={message.senderName || ""}
                        onDelete={() => onDeleteMessage?.(message.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* ── Typing indicator ── */}
      <TypingIndicator users={typingUsers} />

      {/* ── Message input ── */}
      <div className="px-4 pb-4 pt-2 border-t border-border bg-card shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-muted/50 rounded-2xl px-3 py-2 border border-border focus-within:border-stp-blue-light/40 transition-colors">
            {/* File attach */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0 pb-0.5"
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileAttach}
            />

            <Textarea
              ref={textareaRef}
              placeholder="Type a message…"
              value={newMessage}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-1 min-h-[24px] max-h-[120px] resize-none text-sm"
              rows={1}
            />

            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              <Button
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all",
                  newMessage.trim()
                    ? "bg-stp-blue-light hover:bg-stp-blue-light/90 text-white"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                onClick={handleSend}
                disabled={!newMessage.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}