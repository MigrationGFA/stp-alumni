import { Check, CheckCheck, Clock, AlertCircle, RotateCcw, Trash2, FileText, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/helper";
import Image from "next/image";

function MessageStatus({ status }) {
  switch (status) {
    case "sending":
      return <Clock className="h-3 w-3 text-muted-foreground" />;
    case "sent":
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case "delivered":
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case "read":
      return <CheckCheck className="h-3 w-3 text-primary" />;
    case "failed":
      return <AlertCircle className="h-3 w-3 text-destructive" />;
    default:
      return null;
  }
}

function MediaContent({ message }) {
  if (!message.mediaUrl) return null;

  const isImage =
    message.mediaType === "image" ||
    /\.(jpg|jpeg|png|gif|webp)$/i.test(message.mediaUrl);

  if (isImage) {
    return (
      <div className="relative rounded-lg overflow-hidden mt-1 mb-1 max-w-xs">
        <Image
          src={message.mediaUrl}
          alt="Shared image"
          width={300}
          height={200}
          className="object-cover rounded-lg"
          unoptimized={message.mediaUrl.startsWith("blob:")}
        />
      </div>
    );
  }

  // Document
  const fileName = message.mediaUrl.split("/").pop() || "Document";
  return (
    <a
      href={message.mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg mt-1 mb-1 transition-colors",
        message.isOwn
          ? "bg-white/10 hover:bg-white/20"
          : "bg-muted hover:bg-muted/80"
      )}
    >
      <FileText className="h-5 w-5 shrink-0" />
      <span className="text-xs truncate flex-1">{fileName}</span>
      <Download className="h-4 w-4 shrink-0 opacity-60" />
    </a>
  );
}

export function MessageBubble({
  message,
  senderAvatar,
  senderName,
  onRetry,
  onDelete,
}) {
  const isFailed = message.status === "failed";
  const createdAt =
    message.createdAt instanceof Date
      ? message.createdAt
      : new Date(message.createdAt);

  return (
    <div
      className={cn(
        "flex gap-3 group",
        message.isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!message.isOwn && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback>
            {(senderName || "?")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          message.isOwn ? "items-end" : "items-start"
        )}
      >
        {!message.isOwn && (
          <span className="text-xs font-medium text-foreground mb-1">
            {senderName}
          </span>
        )}

        <div className="flex items-end gap-2">
          {/* Actions for own messages */}
          {message.isOwn && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isFailed && onRetry && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRetry}>
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Retry</TooltipContent>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}

          <div
            className={cn(
              "px-4 py-2.5 rounded-2xl text-sm",
              message.isOwn
                ? "bg-stp-blue-light text-white rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md",
              isFailed && "opacity-60"
            )}
          >
            <MediaContent message={message} />
            {message.content && (
              <span className="whitespace-pre-wrap">{message.content}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(createdAt)}
          </span>
          {message.isOwn && <MessageStatus status={message.status} />}
        </div>

        {isFailed && (
          <span className="text-xs text-destructive mt-0.5">
            Failed to send. Tap to retry.
          </span>
        )}
      </div>
    </div>
  );
}
