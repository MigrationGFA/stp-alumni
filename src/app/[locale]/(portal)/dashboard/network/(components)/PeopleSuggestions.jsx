import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import useNetworkStore from "@/lib/store/useNetworkStore";
import { Skeleton } from "@/components/ui/skeleton";

export function PeopleSuggestions() {
  const { sameSkillUsers, options } = useNetworkStore();
  const { isLoading, error } = options;

  console.log(sameSkillUsers,"sameSkillUsers")

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            People with your skill you may know
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sameSkillUsers || sameSkillUsers.length === 0) {
    return null; // Don't show the block at all if empty
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          People with your skill you may know
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sameSkillUsers.map((person) => {
            // Pick a random gradient until backend supports cover photos
            const gradients = [
              "bg-gradient-to-br from-pink-400 to-rose-500",
              "bg-gradient-to-br from-blue-500 to-cyan-500",
              "bg-gradient-to-br from-amber-500 to-orange-600",
              "bg-gradient-to-br from-emerald-400 to-teal-500"
            ];
            const coverColor = gradients[Math.floor(Math.random() * gradients.length)];
            const fullName = `${person.firstName || ''} ${person.lastName || ''}`.trim();

            // Format sector JSON string fallback to normal string
            let formattedRole = "";
            try {
              const sectors = Array.isArray(person.sector) ? person.sector : JSON.parse(person.sector || "[]");
              formattedRole = sectors.length > 0 ? sectors.join(', ') : "Professional";
            } catch (e) {
              formattedRole = person.sector || "Professional";
            }

            return (
              <div
                key={person.userId}
                className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow"
              >
                {/* Cover Image */}
                <div className="relative h-32">
                  <div className={`absolute inset-0 ${coverColor}`} />
                  {person.profileImageUrl ? (
                    <img
                      src={person.profileImageUrl}
                      alt={fullName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <Avatar className="h-full w-full rounded-none">
                        <AvatarFallback className="text-4xl bg-transparent">{fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-sm line-clamp-1">{fullName}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {formattedRole}
                  </p>

                  <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span className="line-clamp-1">Explore Network</span>
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
