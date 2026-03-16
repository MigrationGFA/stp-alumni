import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Video, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEventStore } from "@/lib/store/useEventStore";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import Image from "next/image";

export function EventsContent() {
  const { events, isLoading } = useEventStore();
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingEvents = events?.filter(e => new Date(e.startTime) > new Date()) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Upcoming Events ({upcomingEvents.length})
        </CardTitle>
        <Button variant="link" className="text-accent p-0 h-auto">
          Discover events
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? upcomingEvents.map((event) => {
            const isOnline = event.type === 'online';
            const locationString = isOnline ? 'Online Event' : (event.venue || 'TBA');

            return (
              <div
                key={event.eventId}
                className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row"
              >
                {/* Cover Image */}
                <div className="relative h-32 sm:h-auto sm:w-48 shrink-0 bg-muted">
                  {event.coverImageUrl ? (
                    <Image
                      src={event.coverImageUrl}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-accent/20">
                      <Calendar className="h-8 w-8 opacity-50" />
                    </div>
                  )}
                  <Badge
                    className="absolute top-2 left-2 bg-accent text-accent-foreground"
                  >
                    Upcoming
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{event.name}</h3>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{dayjs(event.startTime).format('ddd, MMM D, YYYY')} • {dayjs(event.startTime).format('h:mm A')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {isOnline ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        <span>{locationString}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-stp-blue-light text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
                      asChild
                    >
                      <a href={isOnline ? event.externalLink : "#"} target={isOnline ? "_blank" : "_self"} rel="noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {isOnline ? 'Go to Link' : 'View Details'}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-8 w-8 opacity-20 mb-3" />
              <p>No upcoming events at the moment.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}