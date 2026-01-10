"use client"
import { Home, Store, Users, MessageSquare, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Network", href: "/network" },
  { icon: Newspaper, label: "Feed", href: "/newsfeed" },
  { icon: MessageSquare, label: "Messages", href: "/messaging" },
  { icon: Store, label: "Market", href: "/marketplace" },
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
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive && "fill-primary/20"
              )} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}