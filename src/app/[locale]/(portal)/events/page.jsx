"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { YourEventCard } from "./YourEventCard";
import { EventCard } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";

const yourEvents = [
  {
    id: 1,
    name: "Lead with a Grounded Confidence in a Changing...",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Leadership Academy",
    attendees: 45,
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Lead with a Grounded Confidence in a Changing...",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Leadership Academy",
    attendees: 32,
    cover: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=200&h=200&fit=crop",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Lead with a Grounded Confidence in a Changing...",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Leadership Academy",
    attendees: 28,
    cover: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop",
    status: "upcoming",
  },
  {
    id: 4,
    name: "Tech Innovation Summit 2025",
    date: "Sat, Dec 20, 2025",
    time: "9:00AM",
    organizer: "Tech Africa",
    attendees: 156,
    cover: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=200&h=200&fit=crop",
    status: "upcoming",
  },
  {
    id: 5,
    name: "Startup Networking Night",
    date: "Mon, Dec 22, 2025",
    time: "6:00PM",
    organizer: "Founders Hub",
    attendees: 89,
    cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=200&fit=crop",
    status: "upcoming",
  },
];

const allRecommendedEvents = [
  {
    id: 4,
    name: "JSworld Conference Africa - Diversity Focus",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Alphamarine Photography LTD",
    attendees: 1,
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 5,
    name: "9th Global Summit on Precision Diagnosis and Treatment of Prostate Cancer",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Alphamarine Photography LTD",
    attendees: 1,
    cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 6,
    name: "2025 Drive for the Driven Golf Tournament",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Alphamarine Photography LTD",
    attendees: 100,
    cover: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 7,
    name: "JSworld Conference Africa - Diversity Focus",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Alphamarine Photography LTD",
    attendees: 1,
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 8,
    name: "9th Global Summit on Precision Diagnosis and Treatment of Prostate Cancer",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Alphamarine Photography LTD",
    attendees: 1,
    cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 9,
    name: "2025 Drive for the Driven Golf Tournament",
    date: "Fri, Dec 15, 2025",
    time: "7:00PM",
    organizer: "Alphamarine Photography LTD",
    attendees: 100,
    cover: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 10,
    name: "AI & Machine Learning Workshop",
    date: "Sat, Dec 18, 2025",
    time: "10:00AM",
    organizer: "Tech Academy Africa",
    attendees: 75,
    cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 11,
    name: "Women in Tech Leadership Summit",
    date: "Wed, Dec 20, 2025",
    time: "9:00AM",
    organizer: "WiT Foundation",
    attendees: 200,
    cover: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
    status: "upcoming",
  },
  {
    id: 12,
    name: "Startup Pitch Night 2025",
    date: "Thu, Dec 21, 2025",
    time: "6:00PM",
    organizer: "Venture Hub Africa",
    attendees: 150,
    cover: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
    status: "upcoming",
  },
];

const ITEMS_PER_PAGE = 6;

export default function Events() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showAllYourEvents, setShowAllYourEvents] = useState(false);
  const [recommendedPage, setRecommendedPage] = useState(1);

  const displayedYourEvents = showAllYourEvents ? yourEvents : yourEvents.slice(0, 3);
  const displayedRecommendedEvents = allRecommendedEvents.slice(0, recommendedPage * ITEMS_PER_PAGE);
  const hasMoreRecommended = displayedRecommendedEvents.length < allRecommendedEvents.length;

  const handleShowMoreRecommended = () => {
    setRecommendedPage((prev) => prev + 1);
  };

  return (
    <>
    <div className="space-y-6 px-4 sm:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary">Events</h1>

        {/* Banner: Stack on mobile, row on sm+ */}
        <div className="bg-[#1B2F5B] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-primary-foreground font-medium text-sm sm:text-base">
            Set up your next event in minutes.
          </p>
          <Button
            variant="secondary"
            className="bg-transparent text-white border rounded-2xl hover:bg-background/90 hover:text-stp-blue-light text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create an event
          </Button>
        </div>

        {/* Your Events: Grid for mobile/desktop, scroll only if preferred */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-sm font-semibold mb-4">Your events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedYourEvents.map((event) => (
              <YourEventCard key={event.id} event={event} />
            ))}
          </div>

          {yourEvents.length > 3 && (
            <button
              onClick={() => setShowAllYourEvents(!showAllYourEvents)}
              className="text-sm text-muted-foreground hover:text-foreground mt-6 mx-auto block"
            >
              {showAllYourEvents ? "Show less" : "Show all"}
            </button>
          )}
        </div>

        {/* Recommended: Fluid Grid */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-sm font-semibold mb-4">Recommended for you</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedRecommendedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {hasMoreRecommended && (
            <button
              onClick={handleShowMoreRecommended}
              className="text-sm text-muted-foreground hover:text-foreground mt-8 mx-auto block"
            >
              Show more
            </button>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}
