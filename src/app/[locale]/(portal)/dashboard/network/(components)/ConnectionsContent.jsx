import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical, MessageCircle, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useNetworkStore from "@/lib/store/useNetworkStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";
import { useSendInvitation } from "@/lib/hooks/useMessagingQueries";
import { useRouter } from "@/i18n/routing";

export function ConnectionsContent() {
  const { myConnections, networkUsers, options } = useNetworkStore();
  const { isLoading, error } = options;

  const router = useRouter();

  const { mutate: connectToUser, isPending: isConnecting } = useMutation({
    mutationFn: (id) => networkService.connectToUser(id),
  });

  const { mutate: sendInvitation, isPending: isInviting } = useSendInvitation();


  // Decide which list to render. If the user has connections, show them.
  // Otherwise, fallback to showing the general network (All available active users).
  const hasConnections = myConnections && myConnections.length > 0;
  const displayList = hasConnections ? myConnections : (networkUsers || []);

  console.log(myConnections,"displayList")
  const titleString = hasConnections
    ? `My Connections (${myConnections.length})`
    : `Explore Network (${displayList.length})`;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">
            Loading Network...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayList.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Network</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No network connections found yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          {titleString}
        </CardTitle>
        <Select>
          <SelectTrigger className="w-60 text-[#020618]/50 text-sm">
            <SelectValue placeholder="Sorted by: Recently Added" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>
              <SelectItem value="val">Apple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-0">
        {displayList.map((connection, index) => {
          const isNetworkExplorerItem = !hasConnections;
          // Determine identifiers based on if we are mapping an actual connection object or a raw user object
          const id = connection.connectionId || connection.userId;
          const fullName = connection.name || `${connection.firstName || ''} ${connection.lastName || ''}`.trim();
          const avatar = connection.profileImageUrl || connection.avatar;

          let formattedRole = "";
          try {
            const sectors = Array.isArray(connection.sector) ? connection.sector : JSON.parse(connection.sector || "[]");
            formattedRole = sectors.length > 0 ? sectors.join(', ') : "Professional";
          } catch (e) {
            formattedRole = connection.sector || connection.role || "Professional";
          }

          return (
            <div
              key={id}
              className={`flex items-center justify-between py-4 ${index !== displayList.length - 1 ? "border-b border-border" : ""
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
                  <p className="text-sm font-semibold truncate">
                    {fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formattedRole}
                  </p>
                  <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                    {connection.connectedSince || (isNetworkExplorerItem ? "Available on STP" : "Recently added")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isConnecting || isInviting}
                  className="border-0 sm:border-stp-blue-light rounded-2xl text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    if (isNetworkExplorerItem) {
                      connectToUser(connection.userId);
                    } else {
                      // Send a messaging invitation then navigate
                      sendInvitation(
                        { recipientId: connection.userId, shortMessage: "" },
                        { onSuccess: () => router.push("/dashboard/messaging") }
                      );
                    }
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-1 sm:hidden block" />
                  <span className="hidden sm:inline">
                    {isConnecting || isInviting
                      ? "Connecting..."
                      : isNetworkExplorerItem
                        ? "Connect"
                        : "Message"}
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
                    {!isNetworkExplorerItem && (
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
        })}
      </CardContent>
    </Card>
  );
}
