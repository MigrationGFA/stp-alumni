import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical, MessageCircle, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { useSendInvitation } from "@/lib/hooks/useMessagingQueries";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

function ConnectionUser({ connection, index,connectionTotal }) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: connectToUser, isPending: isConnecting } = useMutation({
    mutationFn: (data) => networkService.connectToUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network"] });
      toast.success("Connection request sent!")
    },
  });

  const { mutate: sendInvitation, isPending: isInviting } = useSendInvitation();

  // const isNetworkExplorerItem = !hasConnections;
  // Determine identifiers based on if we are mapping an actual connection object or a raw user object
  const id = connection.connectionId || connection.userId;
  const fullName =
    connection.name ||
    `${connection.firstName || ""} ${connection.lastName || ""}`.trim();
  const avatar = connection.profileImageUrl || connection.avatar;
  const isConnected = connection.connectionStatus === "ACCEPTED";
  const isPending = connection.connectionStatus === "PENDING";
  const isNotConnected = connection.connectionStatus === null;

  let formattedRole = "";
  try {
    const sectors = Array.isArray(connection.sector)
      ? connection.sector
      : JSON.parse(connection.sector || "[]");
    formattedRole = sectors.length > 0 ? sectors.join(", ") : "Professional";
  } catch (e) {
    formattedRole = connection.sector || connection.role || "Professional";
  }
  return (
    <div
      key={id}
      className={`flex items-center justify-between py-4 ${
        index !== connectionTotal - 1 ? "border-b border-border" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={avatar} alt={fullName} />
          <AvatarFallback className="bg-muted">
            {fullName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {formattedRole}
          </p>
          <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
            {connection.connectedSince ||
              (isConnected ? "Available on STP" : "Recently added")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isConnecting}
          className="border-0 sm:border-stp-blue-light rounded-2xl text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            if (isNotConnected) {
              connectToUser({ userId: connection.userId });
            } else if (isPending) {
              toast.info("Your connection request is pending approval.");
              return;
            } else {
              // Send a messaging invitation then navigate

              // console.log("lol")
              sendInvitation(
                {
                  recipientId: connection.userId,
                  shortMessage: "Hi, I'd like to connect with you!",
                },
                {
                  onSuccess: () => router.push("/dashboard/messaging"),
                },
              );
            }
          }}
        >
          <MessageCircle className="h-4 w-4 mr-1 sm:hidden block" />
          <span className="hidden sm:inline">
            {isConnecting
              ? "Connecting..."
              : isPending
                ? "Pending"
                : isConnected
                  ? "Message"
                  : "Connect"}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            {isConnected && (
              <DropdownMenuItem className="text-destructive">
                <UserMinus className="h-4 w-4 mr-2" />
                Remove Connection
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ConnectionUser;
