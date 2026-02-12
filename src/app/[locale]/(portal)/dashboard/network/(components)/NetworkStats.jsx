"use client";
import { Unplug, UsersRound, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";

const stats = [
  { icon: Unplug, label: "Connections", value: 100, tab: "/" },
  { icon: UsersRound, label: "Groups", value: 5, tab: "/groups" },
  { icon: CalendarDays, label: "Events", value: 3, tab: "/my-event" },
];

export function NetworkStats({ onTabChange }) {
  const pathname = usePathname();
const basePath = "/dashboard/network";

  const activeTab = pathname === basePath ? "/" : pathname.replace(basePath, "");
  // const activeTab = usePathname().split("/").pop();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Manage my network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {stats.map((stat) => (
          <Link key={stat.label} href={`/dashboard/network${stat.tab}`}>
          <button
            
            // onClick={() => router.replace(`/network/${stat.tab}`)}
            className={cn(
              "flex items-center justify-between py-3 border-b border-border -mx-4 px-4 transition-all duration-200 cursor-pointer w-full text-left",
              activeTab === stat.tab
                ? "bg-[#233389]/10 border-l-4 border-l-[#233389]"
                : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <stat.icon
                className={cn(
                  "h-5 w-5",
                  activeTab === stat.tab
                    ? "text-stp-blue-light"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  activeTab === stat.tab && "text-stp-blue-light"
                )}
              >
                {stat.label}
              </span>
            </div>
            {/* <span className="text-sm font-semibold text-primary">
              {stat.value}
            </span>{" "} */}
            <span
              className={cn(
                "text-sm font-semibold",
                activeTab === stat.tab
                  ? "text-stp-blue-light"
                  : "text-primary/70"
              )}
            >
              {stat.value}
            </span>
          </button>
          </Link>

        ))}
      </CardContent>
    </Card>
  );
}
