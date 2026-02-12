import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Video, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    name: "STP Alumni Annual Meetup 2024",
    date: "Sat, Mar 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Lagos, Nigeria",
    isVirtual: false,
    attendees: 156,
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Tech Career Workshop",
    date: "Wed, Mar 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Zoom Webinar",
    isVirtual: true,
    attendees: 89,
    cover: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=200&fit=crop",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Startup Pitch Night",
    date: "Fri, Mar 28, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Abuja, Nigeria",
    isVirtual: false,
    attendees: 234,
    cover: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop",
    status: "upcoming",
  },
];

export function EventsContent() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          My Events ({events.length})
        </CardTitle>
        <Button variant="link" className="text-accent p-0 h-auto">
          Discover events
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-border rounded-lg overflow-hidden hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row"
            >
              {/* Cover Image */}
              <div className="relative h-32 sm:h-auto sm:w-48 shrink-0">
                <img
                  src={event.cover}
                  alt={event.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <Badge 
                  className="absolute top-2 left-2 bg-accent text-accent-foreground"
                >
                  {event.status === "upcoming" ? "Upcoming" : "Past"}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">{event.name}</h3>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {event.isVirtual ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-stp-blue-light text-stp-blue-light hover:bg-accent hover:text-accent-foreground"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}