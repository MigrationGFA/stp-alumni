# Backend Requirements: Newsfeed

## 1. Module Overview
The Newsfeed serves as the authoritative source for announcements and community updates. The critical architectural shift for this module is **Access Control**: the main feed acts as a broadcast mechanism controlled entirely by the Admin Backoffice, rather than an open peer-to-peer social wall.

---

## 2. Database Schema Modifications

### A. The Post Entity
The existing `Post` table/document must be updated to support categorization and longer-form authoritative content.
- `authorId` (UUID/String) - Must reference a user with an Admin role.
- `title` (String) - Represents the heading of the announcement.
- `body` (Text / Rich Text) - The full content of the post/article.
- `category` (String / Enum) - Required for organization (e.g., "Announcement", "Industry Update", "Spotlight").
- `imageUrls` (Array of Strings) - Supported media generated via AWS S3 (or equivalent) presigned uploads.
- `createdAt`, `updatedAt` (Timestamps)

### B. Engagement Entities
These standard relational/sub-document entities handle the social interaction aspects:
- **Comment:** `id`, `postId`, `userId`, `commentText`, `createdAt`.
- **Like:** `postId`, `userId` (Compound Unique Index to prevent double-liking).

---

## 3. Required API Endpoints & Logic

### A. Restricted Creation & Admin Management
- **Endpoints:** `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id`
- **Strict RBAC Rule:** The backend MUST aggressively evaluate the requester's role. If the decoded authentication token indicates the user is a standard alumni (`role !== 'admin'`), the API must immediately reject the request with a `403 Forbidden` HTTP status.
- **Expected Creation Payload:**
  - `title`, `body`, `category`
  - `postImages[]` (Multi-part files or pre-uploaded URLs)

### B. Intelligent Fetching & Search
- **Endpoint:** `GET /posts`
- **Logic Requirements:** This public-facing fetch endpoint must accept query parameters to satisfy the "categorized and searchable" UI requirement.
  - `?category=<CategoryName>`: Filters standard posts by specific organizational tabs.
  - `?search=<Keyword>`: Allows users to search for distinct topics via a database string-matching query on `title` and `body`.
  - `?page=<N>&limit=<N>`: Pagination constraints to ensure payload size remains performant on mobile connections.

### C. Direct Sharing & Deep Linking
- **Endpoint:** `GET /posts/:id`
- **Logic Requirements:** Because users can "copy links to share specific updates," the frontend will route returning users to a specific standalone URL (e.g., `/feed/123`). This endpoint must return a single enriched Post DTO, alongside its `likeCount`, `commentCount`, and `hasUserLiked` boolean flag.

### D. User Engagement (Public)
The following endpoints remain accessible to all authenticated alumni (Admin & Standard):
- **Like Toggle:** `POST /posts/:id/like` - Toggles the like record for the authenticated user.
- **Publish Comment:** `POST /posts/:id/comment` - Adds a comment to the respective post.
- **Fetch Comments:** `GET /posts/:id/comments` - Fetches the comment thread with basic pagination mapping.
