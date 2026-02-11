
// components/UserCard.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ReactNode } from "react";


const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14"
};

export function UserCard({
  user,
  showTitle = true,
  className = "",
  avatarSize = "md",
  showFallbackInitial = true,
  children,
  onClick
}) {
  // Determine profile URL
  const profileUrl = user.href || `/profile/${user.id || user.username}`;
  
  // Get fallback initial
  const fallbackInitial = showFallbackInitial 
    ? user.name.charAt(0).toUpperCase()
    : "";

  return (
    <div 
      className={`flex items-start gap-3 ${className}`}
      onClick={onClick}
    >
      <Avatar className={sizeClasses[avatarSize]}>
        <AvatarImage 
          src={user.avatar} 
          alt={user.name} 
          className="object-cover"
        />
        <AvatarFallback className="bg-muted">
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <Link 
          href={profileUrl}
          className="text-sm font-semibold hover:underline transition-colors cursor-pointer block"
          onClick={(e) => e.stopPropagation()} // Prevent parent onClick from firing
        >
          {user.name}
        </Link>
        
        {showTitle && user.title && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {user.title}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
}
