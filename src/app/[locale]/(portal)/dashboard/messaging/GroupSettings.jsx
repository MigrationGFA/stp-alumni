"use client";

import { useState } from "react";
import { Settings, Users, Check, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useJoinRequests,
  useRespondToJoinRequest,
  useUpdateGroupSettings,
} from "@/lib/hooks/useMessagingQueries";

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

/**
 * Group settings dialog for PUBLIC_GROUP admins.
 * Shows group settings form and pending join requests.
 */
export function GroupSettingsDialog({ open, onOpenChange, conversation }) {
  if (!conversation) return null;

  const groupId = conversation.conversationId || conversation.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-stp-blue-light" />
            Group Settings
          </DialogTitle>
          <DialogDescription>{conversation.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <GroupSettingsForm groupId={groupId} conversation={conversation} />
          <div className="border-t border-border" />
          <JoinRequestsList groupId={groupId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Form to update group name, description, and open/closed status.
 */
function GroupSettingsForm({ groupId, conversation }) {
  const [name, setName] = useState(conversation.name || "");
  const [description, setDescription] = useState(conversation.description || "");
  const [isOpen, setIsOpen] = useState(
    conversation.isOpen === 1 || conversation.isOpen === "1" || conversation.isOpen === true
  );

  const { mutate: updateSettings, isPending } = useUpdateGroupSettings();

  const handleSave = () => {
    updateSettings({
      groupId,
      data: {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        isOpen: isOpen ? 1 : 0,
      },
    });
  };

  const hasChanges =
    name !== (conversation.name || "") ||
    description !== (conversation.description || "") ||
    isOpen !== (conversation.isOpen === 1 || conversation.isOpen === "1" || conversation.isOpen === true);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </h3>

      <div className="space-y-2">
        <Label>Group Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Open Group</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isOpen ? "Anyone can join instantly" : "Requires admin approval"}
          </p>
        </div>
        <Switch checked={isOpen} onCheckedChange={setIsOpen} disabled={isPending} />
      </div>

      {hasChanges && (
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full bg-stp-blue-light hover:bg-stp-blue-light/90 text-white"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      )}
    </div>
  );
}

/**
 * List of pending join requests with approve/reject actions.
 */
function JoinRequestsList({ groupId }) {
  const { data: requestsData, isLoading } = useJoinRequests(groupId);
  const { mutate: respond, isPending } = useRespondToJoinRequest();

  const requests = Array.isArray(requestsData?.data)
    ? requestsData.data
    : Array.isArray(requestsData)
      ? requestsData
      : [];

  const handleRespond = (requestId, action) => {
    respond({ groupId, requestId, action });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Users className="h-4 w-4" />
        Join Requests
        {requests.length > 0 && (
          <span className="px-1.5 min-w-[1.25rem] h-5 rounded-full bg-stp-blue-light text-white text-xs font-medium inline-flex items-center justify-center">
            {requests.length}
          </span>
        )}
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-28 flex-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          No pending requests.
        </p>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => {
            const reqId = req.requestId || req.id;
            const name = `${req.firstName} ${req.lastName}` || "User";
            const avatar = req.userAvatar || req.user?.profileImagePath || null;

            return (
              <div
                key={reqId}
                className="flex items-center gap-3 p-2 rounded-lg border border-border"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium flex-1 truncate">{name}</span>
                <div className="flex gap-1.5 shrink-0">
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleRespond(reqId, "approve")}
                    disabled={isPending}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleRespond(reqId, "reject")}
                    disabled={isPending}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
