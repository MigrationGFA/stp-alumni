"use client"
import { Home, Users, ShoppingBag, Newspaper, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Network", href: "/dashboard/network" },
  { icon: ShoppingBag, label: "Market Place", href: "/dashboard/marketplace" },
  { icon: Newspaper, label: "Feed", href: "/dashboard/newsfeed" },
  { icon: Calendar, label: "Events", href: "/dashboard/events" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 h-full transition-colors shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
