"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { YourEventCard } from "./YourEventCard";
import { EventCard } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { useNavbar } from "@/contexts/NavbarContext";
import Container from "@/components/container";
import { allRecommendedEvents, yourEvents } from "@/lib/data";
import { usePathname } from "@/i18n/routing";

const ITEMS_PER_PAGE = 6;

export default function EventUi() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showAllYourEvents, setShowAllYourEvents] = useState(false);
  const [recommendedPage, setRecommendedPage] = useState(1);

  const {
    size: { height },
  } = useNavbar();
   const pathname = usePathname();
  const isAuth = true; // Placeholder
  const isShow = pathname.includes("dashboard");

  const displayedYourEvents = showAllYourEvents
    ? yourEvents
    : yourEvents.slice(0, 3);
  const displayedRecommendedEvents = allRecommendedEvents.slice(
    0,
    recommendedPage * ITEMS_PER_PAGE,
  );
  const hasMoreRecommended =
    displayedRecommendedEvents.length < allRecommendedEvents.length;

  return (
    <>
      <div className="space-y-6 px-4 sm:px-0" style={{ marginTop: `${height}px` }}>
        {!isShow ? (
          <>
            {" "}
            <div className="bg-linear-to-l from-[#1B2F5B] to-[#3964C1] p-7 mb-5">
              <h1 className="text-2xl lg:text-3xl font-bold text-white text-center">
                Events
              </h1>
            </div>
            <Container className="mx-auto space-y-6">
              <EventListContent
                isAuth={isAuth}
                yourEventsData={{
                  list: displayedYourEvents,
                  total: yourEvents.length,
                  isExpanded: showAllYourEvents,
                  toggle: () => setShowAllYourEvents(!showAllYourEvents),
                }}
                recommendedData={{
                  list: displayedRecommendedEvents,
                  hasMore: hasMoreRecommended,
                  loadMore: () => setRecommendedPage((prev) => prev + 1),
                }}
                onCreateClick={() => setIsCreateModalOpen(true)}
              />
            </Container>
          </>
        ) : (
          <>
            <h1 className="text-2xl lg:text-3xl font-bold text-stp-blue-light">
              Events
            </h1>
            <EventListContent
              isAuth={isAuth}
              isShow={isShow}
              yourEventsData={{
                list: displayedYourEvents,
                total: yourEvents.length,
                isExpanded: showAllYourEvents,
                toggle: () => setShowAllYourEvents(!showAllYourEvents),
              }}
              recommendedData={{
                list: displayedRecommendedEvents,
                hasMore: hasMoreRecommended,
                loadMore: () => setRecommendedPage((prev) => prev + 1),
              }}
              onCreateClick={() => setIsCreateModalOpen(true)}
            />
          </>
        )}
      </div>

      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}

/**
 * Extracted Content Component
 */
function EventListContent({
  isAuth,
  isShow,
  yourEventsData,
  recommendedData,
  onCreateClick,
}) {
  return (
    <>
      {/* Banner */}
      {isAuth && isShow && (
        <div className="bg-[#1B2F5B] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-primary-foreground font-medium text-sm sm:text-base">
            Set up your next event in minutes.
          </p>
          <Button
            variant="secondary"
            className="bg-transparent text-white border rounded-2xl hover:bg-background/90 hover:text-stp-blue-light text-xs sm:text-sm w-full sm:w-auto"
            onClick={onCreateClick}
          >
            Create an event
          </Button>
        </div>
      )}

      {/* Your Events Section */}
      {isAuth && (
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-sm font-semibold mb-4">Your events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourEventsData.list.map((event) => (
              <YourEventCard key={event.id} event={event} />
            ))}
          </div>

          {yourEventsData.total > 3 && (
            <button
              onClick={yourEventsData.toggle}
              className="text-sm text-muted-foreground hover:text-foreground mt-6 mx-auto block"
            >
              {yourEventsData.isExpanded ? "Show less" : "Show all"}
            </button>
          )}
        </div>
      )}

      {/* Recommended Section */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h2 className="text-sm font-semibold mb-4">Recommended for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedData.list.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {recommendedData.hasMore && (
          <button
            onClick={recommendedData.loadMore}
            className="text-sm text-muted-foreground hover:text-foreground mt-8 mx-auto block"
          >
            Show more
          </button>
        )}
      </div>
    </>
  );
}
