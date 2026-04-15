import { ModernScrollArea } from "@/components/shared/ScrollArea";
import {
  Loader,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { messages } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { toast } from "sonner";

function SidebarWidgets({ t, height }) {
  // Fetch your network data
  const { data: networkData, isLoading: isLoadingNetwork } = useQuery({
    queryKey: ["network"],
    queryFn: () => networkService.getNetwork(),
  });

  // Fetch invitations/connections data
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => networkService.getIncomingRequests(),
  });
  // console.log("networkData",networkData)

  // Parse mapped network payload safely
  const networkContacts = networkData?.data || networkData || {};

  // Parse mapped invitations safely (assuming response is array or .data array)
  // Filtering loosely for "pending" status if available; else relying on API struct
  const rawConnections = Array.isArray(connectionsData?.data)
    ? connectionsData.data
    : Array.isArray(connectionsData)
      ? connectionsData
      : [];

  const invitations = rawConnections.slice(0, 5);

  console.log(networkData, "networkData");
  return (
    <aside
      className="sticky left-0  w-full overflow-y-auto"
      style={{
        top: `${height + 10}px`,
        height: `calc(100dvh - ${height}px)`,
      }}
    >
      <ModernScrollArea
        className={` w-full`}
        // style={{
        //   height: `calc(100vh - ${height}px - 1rem)`,
        // }}
      >
        <div className="space-y-6">
          {/* Your Network */}
          <div>
            <h3 className="font-semibold text-[#233389] mb-4">
              {t("yourNetwork")}
            </h3>
            <div className="space-y-3">
              {isLoadingNetwork ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#233389]"></div>
                </div>
              ) : networkContacts.length > 0 ? (
                networkContacts
                  .slice(0, 5)
                  .filter((ele) => ele.connectionStatus === "ACCEPTED")
                  .map((contact, index) => (
                    <div
                      key={contact.id || index}
                      className="bg-white rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                          <Image
                            src={
                              contact.profileImagePath ||
                              "/assets/Your Newtork Image.jpg"
                            }
                            alt={contact.name || contact.firstName || "User"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs text-[#233389] truncate">
                            {contact.firstName || "Anonymous"}{" "}
                            {contact.lastName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {contact.role || contact.email || "Member"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {contact.connectionStatus === "ACCEPTED" && (
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MessageCircle className="h-4 w-4 text-[#233389]" />
                          </button>
                        )}
                        {contact.connectionStatus === null && (
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="h-4 w-4 text-[#233389]" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg">
                  Go connect to build your network!
                </div>
              )}
            </div>
          </div>

          {/* Invitations */}
          <div className="bg-white rounded-lg p-4 lg:p-6">
            <h3 className="font-semibold text-[#233389] mb-4">
              {t("invitations")}{" "}
              {invitations.length > 0 ? `(${invitations.length})` : ""}
            </h3>
            <div className="space-y-3">
              {isLoadingConnections ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#233389]"></div>
                </div>
              ) : invitations.length > 0 ? (
                invitations.map((invitation, index) => (
                  <InvitationItem
                    key={index + 1}
                    invitation={invitation}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  No pending invitations.
                </p>
              )}
            </div>
            {invitations.length > 0 && (
              <button className="w-full mt-4 text-center text-sm py-2 border border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl transition-colors">
                {t("seeMore")}
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg p-4 lg:p-6">
            <h3 className="font-semibold text-[#233389] mb-4">
              {t("messages")} (5)
            </h3>
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                    <Image
                      src={message.image}
                      alt={message.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm text-[#233389]">
                        {message.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {message.date}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {t(message.messageKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm py-2 border border-[#233389] text-[#233389] hover:bg-[#233389] hover:text-white rounded-2xl">
              {t("seeMore")}
            </button>
          </div>
        </div>
      </ModernScrollArea>
    </aside>
  );
}

export default SidebarWidgets;

function InvitationItem({ invitation, index }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      networkService.acceptConnection(invitation.connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["network"] });
      toast.success("Connection request accepted");
    },
  });

  const { mutate: ignore, isPending: isIgnoring } = useMutation({
    mutationFn: (data) =>
      networkService.ignoreConnection(invitation.connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.info("Connection request ignored!");
    },
  });

  return (
    <div
      key={invitation.id || index}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
          <Image
            src={
              invitation?.profileImagePath || "/assets/Your Newtork Image.jpg"
            }
            alt={invitation?.firstName || "User"}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-[#233389] truncate">
            {`${invitation?.firstName} ${invitation?.lastName}` ||
              "Pending User"}
          </p>
          <p className="text-xs text-gray-600 truncate">
            Pending connection request
          </p>
        </div>
      </div>
      <button className="p-1 hover:bg-gray-100 rounded shrink-0"></button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isPending || isIgnoring ? (
              <Loader className="animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => ignore(invitation.connectionId)}
            disabled={isPending || isIgnoring}
          >
            Ignore
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => mutate(invitation.connectionId)}
            disabled={isPending || isIgnoring}
          >
            Accept
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
