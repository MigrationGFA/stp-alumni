

// export function YourEventCard({ event }) {
//   return (
//     <div className="flex items-start gap-3 min-w-[280px] cursor-pointer group">
//       {/* Thumbnail */}
//       <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
//         <img
//           src={event.cover}
//           alt={event.name}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <p className="text-xs text-muted-foreground">
//           {event.date}, {event.time}
//         </p>
//         <h4 className="text-sm font-medium line-clamp-2 mt-1 group-hover:text-primary transition-colors">
//           {event.name}
//         </h4>
//       </div>
//     </div>
//   );
// }

export function YourEventCard({ event }) {
  return (
    <div className="flex items-start gap-3 w-full cursor-pointer group">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img src={event.cover} alt={event.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {event.date}, {event.time}
        </p>
        <h4 className="text-sm font-medium line-clamp-2 mt-1 group-hover:text-primary transition-colors">
          {event.name}
        </h4>
      </div>
    </div>
  );
}