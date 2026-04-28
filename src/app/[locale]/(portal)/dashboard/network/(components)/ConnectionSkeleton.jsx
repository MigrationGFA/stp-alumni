

import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton component
export default function ConnectionSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border">
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Skeleton className="h-8 w-20 rounded-2xl" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}