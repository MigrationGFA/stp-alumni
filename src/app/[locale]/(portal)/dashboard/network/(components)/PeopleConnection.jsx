import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

const people = [
  {
    id: 1,
    name: "Ajiboye Opeyemi",
    role: "Web Developer | IT sector",
    mutualConnections: "Wale Aduro and 5 other mutual connections",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop&crop=face",
    coverColor: "bg-gradient-to-br from-pink-400 to-rose-500",
  },
  {
    id: 2,
    name: "Daniel Adeniran",
    role: "Web Developer | IT sector",
    mutualConnections: "Christianah Seile is a mutual connection",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
    coverColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Wale Adedayo",
    role: "Web Developer | IT sector",
    mutualConnections: "Christianah Seile is a mutual connection",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face",
    coverColor: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
];

export function PeopleConnection() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          People in your sector you may know
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => (
            <div
              key={person.id}
              className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-32">
                <div className={`absolute inset-0 ${person.coverColor}`} />
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="font-semibold text-sm">{person.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {person.role}
                </p>

                {/* Mutual connections */}
                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span className="line-clamp-1">{person.mutualConnections}</span>
                </div>

                {/* Connect button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-2xl mt-4 border-stp-blue-light text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
                >
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
