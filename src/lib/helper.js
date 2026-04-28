import { parseISO ,formatDistanceToNowStrict, format, isAfter, subDays} from "date-fns";

/**
 * Generate a unique ID for optimistic updates
 */
export function generateId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a date to relative time string
 */

export function formatRelativeTime(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const now = new Date();
  
  // If the date is older than 7 days, show the short date (e.g., Oct 24)
  if (isAfter(subDays(now, 7), date)) {
    return format(date, "MMM d");
  }

  // Otherwise, show relative time
  const distance = formatDistanceToNowStrict(date, { addSuffix: true });

  // Optional: Convert "minutes" to "m", "hours" to "h" for a compact UI
  return distance
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace("seconds", "just now")
    .replace(" ago", " ago");
}

/**
 * Format time for message timestamps
 */
export function formatMessageTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date for message groups
 */
export function formatMessageDate(date) {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(messages) {
  const groups = new Map();

  messages.forEach((message) => {
    // Convert createdAt to Date object if it's a string
    const date = typeof message.createdAt === 'string' 
      ? parseISO(message.createdAt.replace(' ', 'T')) // Convert "2026-04-14 12:28:58" to ISO format
      : message.createdAt;
    
    // Now date is definitely a Date object
    const dateKey = date.toDateString();
    
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey).push(message);
  });

  return groups;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format distance to now (e.g., "2 hours ago", "3 days ago")
 */
export function formatDistanceToNow(date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
}
