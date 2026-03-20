import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {format} from "date-fns"
import { useRouter } from "next/navigation";

// export function EventCard({ event, onView }) {
//   return (
//     <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
//       {/* Cover Image */}
//       <div className="aspect-[4/3] overflow-hidden">
//         <img
//           src={event.cover}
//           alt={event.name}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Content */}
//       <div className="p-4 space-y-3">
//         <p className="text-xs text-muted-foreground">
//           {event.date}, {event.time}
//         </p>

//         <h3 className="font-semibold text-sm text-[#1B2F5B] leading-tight line-clamp-2 min-h-10">
//           {event.name}
//         </h3>

//         <p className="text-xs text-muted-foreground">
//           {event.organizer} • {event.attendees} attendee{event.attendees !== 1 ? "s" : ""}
//         </p>

//         {/* Actions */}
//         <div className="flex items-center gap-2 pt-1">
//           <Button
//             variant="outline"
//             size="sm"
//             className="flex-1 text-xs h-8 bg-transparent! rounded-2xl border border-[#1B2F5B]! text-[#1B2F5B]! hover:bg-[#1B2F5B]/10!"
//             onClick={() => onView?.(event)}
//           >
//             View
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="h-8 w-8 shrink-0 rounded-2xl border border-[#1B2F5B]! text-[#1B2F5B]! hover:bg-[#1B2F5B]/10!"
//           >
//             <ExternalLink className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

export function EventCard({ event, onView }) {

  const router = useRouter()

  // console.log(event,"event")
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] sm:aspect-[4/3] overflow-hidden">
        <img
          src={event.coverImageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-2 flex-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {format(new Date(event.createdAt), "EEE, MMM d, yyyy, h:mmaa")}
          </p>
          <h3 className="font-semibold text-sm text-[#1B2F5B] leading-tight line-clamp-2">
            {event.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground pb-2">
            {event.createdBy || "User"} • {event.attendees || 0} attendees
          </p>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8 bg-transparent! rounded-2xl border border-[#1B2F5B]! text-[#1B2F5B]! hover:bg-[#1B2F5B]/10!"
            onClick={()=>router.push(`/dashboard/events/${event.eventId}`)}
          >
            View
          </Button>
          <a
            href={event.externalLink}
            target="_blank"
            size="icon"
            className="relative h-8 w-8 flex justify-center items-center rounded-2xl border border-[#1B2F5B]! text-[#1B2F5B]! hover:bg-[#1B2F5B]/10!"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
