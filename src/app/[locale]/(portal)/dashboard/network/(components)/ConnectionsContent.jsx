import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import ConnectionUser from "./ConnectionUser";

export function ConnectionsContent() {
  const { myConnections, networkUsers, options } = useNetworkStore();
  const { isLoading, error } = options;

  // Decide which list to render. If the user has connections, show them.
  // Otherwise, fallback to showing the general network (All available active users).
  const hasConnections = myConnections && myConnections.length > 0;
  const displayList = hasConnections ? myConnections : networkUsers || [];

  console.log(networkUsers, "displayList", myConnections);
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
        <CardTitle className="text-base font-semibold">{titleString}</CardTitle>
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
          return (
            <ConnectionUser
              connection={connection}
              key={connection.userId}
              index={index}
              connectionTotal={displayList.length}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
