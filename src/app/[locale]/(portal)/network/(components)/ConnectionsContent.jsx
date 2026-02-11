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

const connections = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Designer at Meta",
    connectedSince: "Connected 2 years ago",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Software Engineer at Google",
    connectedSince: "Connected 1 year ago",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Williams",
    role: "Marketing Director at Spotify",
    connectedSince: "Connected 6 months ago",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "David Okonkwo",
    role: "Data Scientist at Netflix",
    connectedSince: "Connected 3 months ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Jessica Lee",
    role: "UX Researcher at Apple",
    connectedSince: "Connected 1 month ago",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
];

export function ConnectionsContent() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          My Connections ({connections.length})
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
        {connections.map((connection, index) => (
          <div
            key={connection.id}
            className={`flex items-center justify-between py-4 ${
              index !== connections.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={connection.avatar} />
                <AvatarFallback className="bg-muted">
                  {connection.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {connection.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {connection.role}
                </p>
                <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                  {connection.connectedSince}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <Button
                variant="outline"
                size="sm"
                className="border-0 sm:border-stp-blue-light rounded-2xl text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
              >
                <MessageCircle className="h-4 w-4 mr-1 sm:hidden block" />
                <span className="hidden sm:inline">Message</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove Connection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
