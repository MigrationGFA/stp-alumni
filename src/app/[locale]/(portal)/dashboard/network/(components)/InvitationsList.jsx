import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const invitations = [
  {
    id: 1,
    name: "Bayu Salto",
    message: "Invited you to connect with them",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Bayu Salto",
    message: "Invited you to connect with them",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Bayu Salto",
    message: "Invited you to connect with them",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Bayu Salto",
    message: "Invited you to connect with them",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Bayu Salto",
    message: "Invited you to connect with them",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
  },
];

export function InvitationsList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Invitations ({invitations.length})
        </CardTitle>
        <Button variant="link" className="text-[#020618BF] p-0 h-auto">
          Show all
        </Button>
      </CardHeader>
      <CardContent className="space-y-0">
        {invitations.map((invitation, index) => (
          <div
            key={invitation.id}
            className={`flex items-center justify-between py-3 ${
              index !== invitations.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={invitation.avatar} />
                <AvatarFallback className="bg-muted">
                  {invitation.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{invitation.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {invitation.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
              >
                Ignore
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-stp-blue-light rounded-2xl text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
              >
                Connect
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
