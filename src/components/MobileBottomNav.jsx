"use client"
import { Home, ShoppingBag, Users, MessageSquare, Newspaper, BookOpen, Calendar, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Network", href: "/network" },
  { icon: MessageSquare, label: "Messages", href: "/messaging" },
  // { icon: BookOpen, label: "Resources", href: "/resources" },
  { icon: Newspaper, label: "Feed", href: "/newsfeed" },
  // { icon: ShoppingBag, label: "Market", href: "/marketplace" },
  { icon: Calendar, label: "Events", href: "/events" },
  // { icon: Briefcase, label: "Deal Room", href: "/deal-room" },
];

export function MobileBottomNav() {
  const location = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.includes(item.href) 
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[80px] px-3 h-full transition-colors shrink-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive && "fill-primary/20"
              )} />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}