import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Globe, Lock } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "STP Alumni Network",
    members: 1250,
    isPublic: true,
    description: "Official community for STP program alumni worldwide",
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Tech Founders Circle",
    members: 456,
    isPublic: false,
    description: "Exclusive group for tech startup founders and entrepreneurs",
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Product Managers Hub",
    members: 892,
    isPublic: true,
    description: "Community for product managers to share insights and learn",
    cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    name: "African Tech Leaders",
    members: 2341,
    isPublic: true,
    description: "Connecting technology leaders across the African continent",
    cover: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Women in Tech Nigeria",
    members: 678,
    isPublic: true,
    description: "Supporting and empowering women in the Nigerian tech ecosystem",
    cover: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=200&fit=crop",
  },
];

export function GroupsContent() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          My Groups ({groups.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-24">
                <img
                  src={group.cover}
                  alt={group.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-white text-xs">
                  {group.isPublic ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span>{group.isPublic ? "Public" : "Private"}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-1">{group.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {group.description}
                </p>

                {/* Members count */}
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{group.members.toLocaleString()} members</span>
                </div>

                {/* Action button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  View Group
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}