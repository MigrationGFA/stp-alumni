"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useMutation } from "@tanstack/react-query";
import networkService from "@/lib/services/networkService";

export const formatMySQLDate = (dateStr, formatStr = "MMM d, yyyy") => {
  if (!dateStr) return "";
  try {
    const parsed = new Date(dateStr.replace(" ", "T"));
    if (isNaN(parsed.getTime())) return "";
    return format(parsed, formatStr);
  } catch {
    return "";
  }
};

// 👤 People Card - Mobile Optimized
export function PeopleResultCard({ person }) {
  return (
    <Link href={`/dashboard/profile/${person.user_id}`}>
      <div className="group flex items-start gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-[#155DFC]/30 hover:shadow-md transition-all bg-white">
        <Avatar className="h-10 w-10 sm:h-14 sm:w-14 shrink-0">
          <AvatarImage
            src={person.profile_image_path}
            alt={`${person.first_name} ${person.last_name}`}
          />
          <AvatarFallback className="bg-[#155DFC]/10 text-[#155DFC] font-semibold text-sm sm:text-base">
            {person.first_name?.[0]}
            {person.last_name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 group-hover:text-[#155DFC] transition-colors text-sm sm:text-base">
            {person.first_name} {person.last_name}
          </h3>

          <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">
            {person.title && (
              <>
                <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="truncate">{person.title}</span>
                {person.company && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="truncate hidden sm:inline">{person.company}</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1.5 sm:mt-2">
            {person.graduationYear && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="text-xs">Class of {person.graduationYear}</span>
              </div>
            )}
            {person.location && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="text-xs truncate">{person.location}</span>
              </div>
            )}
          </div>

          {person.mutualConnections > 0 && (
            <p className="text-xs text-slate-500 mt-1.5 sm:mt-2">
              {person.mutualConnections} mutual connection
              {person.mutualConnections !== 1 ? "s" : ""}
            </p>
          )}
        </div>
          
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
        >
          <span className="hidden sm:inline">View Profile</span>
          <span className="sm:hidden">Profile</span>
        </Button>
      </div>
    </Link>
  );
}

// 📝 Post Card - Mobile Optimized
export function PostResultCard({ post }) {
  return (
    <Link href={`/dashboard/post/${post.post_id}`}>
    <div  className="group p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-[#155DFC]/30 hover:shadow-md transition-all bg-white">
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage
            src={post.author?.profileImage}
            alt={post.author?.name}
          />
          <AvatarFallback className="bg-[#155DFC]/10 text-[#155DFC] text-xs sm:text-sm">
            {post.author?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900 group-hover:text-[#155DFC] transition-colors text-sm sm:text-base truncate">
            {post.author?.name}
          </p>
          <p className="text-xs text-slate-500">
            {formatMySQLDate(post.createdAt, "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 line-clamp-3 mb-2 sm:mb-3">
        {post.body}
      </p>

      {post.image_urls && post.image_urls[0] && (
        <img
          src={post.image_urls[0]}
          alt="Post content"
          className="w-full h-32 sm:h-48 object-cover rounded-lg mb-2 sm:mb-3"
        />
      )}

      <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="text-xs">{post.likes || 0}</span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="text-xs">{post.comments || 0}</span>
        </div>
        <button className="flex items-center gap-0.5 sm:gap-1 hover:text-[#155DFC] transition-colors">
          <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="text-xs hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
    </Link>

  );
}

// 📰 Newsfeed Card - Mobile Optimized
export function NewsResultCard({ news }) {
  return (
    <Link href={`/dashboard/newsfeed/${news.post_id}`}>
      <div className="group p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-[#155DFC]/30 hover:shadow-md transition-all bg-white">
        {news.coverImage && (
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2 sm:mb-3"
          />
        )}

        <Badge className="mb-1.5 sm:mb-2 bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/20 border-0 text-[10px] sm:text-xs">
          {news.category}
        </Badge>

        <h3 className="font-semibold text-slate-900 group-hover:text-[#155DFC] transition-colors line-clamp-2 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {news.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2 sm:mb-3">
          {news.excerpt || news.body}
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="text-xs">{formatMySQLDate(news.created_at, "MMM d, yyyy")}</span>
        </div>
      </div>
    </Link>
  );
}

// 🎓 Event Card - Mobile Optimized
export function EventResultCard({ event }) {
  return (
    <Link href={`/dashboard/events/${event.event_id}`}>
      <div className="group p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-[#155DFC]/30 hover:shadow-md transition-all bg-white">
        {event.cover_image_path && (
          <img
            src={event.cover_image_path}
            alt={event.name}
            className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2 sm:mb-3"
          />
        )}

        <h3 className="font-semibold text-slate-900 group-hover:text-[#155DFC] transition-colors line-clamp-2 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {event.name}
        </h3>

        <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155DFC] flex-shrink-0" />
            <span className="text-xs sm:text-sm">
              {formatMySQLDate(event.start_time, "EEE, MMM d")}
            </span>
          </div>

          {event.address && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155DFC] flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{event.address}</span>
            </div>
          )}

          {event.attendees > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#155DFC] flex-shrink-0" />
              <span className="text-xs sm:text-sm">{event.attendees} attending</span>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 sm:mt-3 text-xs sm:text-sm h-8 sm:h-9"
        >
          View Event
        </Button>
      </div>
    </Link>
  );
}

// 👥 Group Card - Mobile Optimized
export function GroupResultCard({ group }) {
  return (
    <Link href={`/dashboard/groups/${group.group_id}`}>
      <div className="group p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-[#155DFC]/30 hover:shadow-md transition-all bg-white">
        {group.image && (
          <img
            src={group.image}
            alt={group.name}
            className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
          />
        )}

        <h3 className="font-semibold text-slate-900 group-hover:text-[#155DFC] transition-colors line-clamp-2 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {group.name}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2 sm:mb-3">
          {group.description}
        </p>

        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{group.member_count} members</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs sm:text-sm h-8 sm:h-9"
        >
          View Group
        </Button>
      </div>
    </Link>
  );
}