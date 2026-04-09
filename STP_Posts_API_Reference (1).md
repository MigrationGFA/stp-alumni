# STP Newsfeed API — Frontend Reference

**Base URL:** `https://app.gfa-tech.com/stp/api`  
**All requests require:** `Authorization: Bearer <token>`

---

## IMPORTANT — Access Rules

| Action | Who can do it |
|---|---|
| Read posts (feed) | Every logged-in user |
| Read single post | Every logged-in user |
| Read comments | Every logged-in user |
| Like / Unlike | Every logged-in user |
| Add a comment | Every logged-in user |
| Create a post | **BACKOFFICE (Admin) only** |
| Edit a post | **BACKOFFICE (Admin) only** |
| Delete a post | **BACKOFFICE (Admin) only** |

If a standard user tries to create/edit/delete, they get `403 Forbidden`.

---

## 1. Get All Posts (News Feed)

```
GET /api/posts
Authorization: Bearer <token>
```

**Query params (all optional):**

| Param | Description | Example |
|---|---|---|
| `category` | Filter by category | `?category=Announcement` |
| `search` | Search in title and body | `?search=funding` |
| `page` | Page number | `?page=1` |
| `limit` | Posts per page (max 50) | `?limit=20` |

**Example:**
```
GET /api/posts?category=Announcement&page=1&limit=10
```

**Response:**
```json
{
  "status": 200,
  "error": false,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "postId": "post_abc123",
      "title": "STP Alumni Summit 2025",
      "body": "We are excited to announce the upcoming Alumni Summit...",
      "category": "Announcement",
      "imageUrls": [
        "https://app.gfa-tech.com/stp/uploads/posts/image1.jpg",
        "https://app.gfa-tech.com/stp/uploads/posts/image2.jpg"
      ],
      "authorId": "uuid",
      "firstName": "STP",
      "lastName": "Admin",
      "profileImagePath": "https://app.gfa-tech.com/stp/uploads/profile-images/abc.jpg",
      "authorTitle": "Programme Director",
      "companyName": "STP",
      "likeCount": 24,
      "commentCount": 8,
      "hasUserLiked": false,
      "createdAt": "2025-12-01 10:00:00",
      "updatedAt": "2025-12-01 10:00:00"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 2. Get Single Post (Deep Link / Share)

```
GET /api/posts/:postId
Authorization: Bearer <token>
```

Use this when a user taps a shared link to a specific post. Returns the same fields as the feed plus the enriched engagement data.

**Example:**
```
GET /api/posts/post_abc123
```

**Response:**
```json
{
  "status": 200,
  "error": false,
  "message": "Post retrieved successfully",
  "data": {
    "postId": "post_abc123",
    "title": "STP Alumni Summit 2025",
    "body": "We are excited to announce...",
    "category": "Announcement",
    "imageUrls": ["https://..."],
    "authorId": "uuid",
    "firstName": "STP",
    "lastName": "Admin",
    "profileImagePath": "https://...",
    "authorTitle": "Programme Director",
    "companyName": "STP",
    "likeCount": 24,
    "commentCount": 8,
    "hasUserLiked": true,
    "createdAt": "2025-12-01 10:00:00",
    "updatedAt": "2025-12-01 10:00:00"
  }
}
```

---

## 3. Create a Post — Admin Only

```
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | Post heading |
| `body` | string | ✅ | Full post content |
| `category` | string | ✅ | See categories below |
| `postImages` | file(s) | ❌ | Up to 5 images. JPG/PNG/GIF/WEBP. Max 5MB each |

**Suggested categories:**
- `Announcement`
- `Industry Update`
- `Spotlight`
- `Event`
- `Opportunity`

**Example form-data:**
```
title        = "STP Alumni Summit 2025"
body         = "We are excited to announce..."
category     = "Announcement"
postImages   = [file1.jpg, file2.jpg]
```

**Response (201):**
```json
{
  "status": 201,
  "error": false,
  "message": "Post created successfully",
  "data": {
    "postId": "post_abc123"
  }
}
```

**Error (403 — if non-admin tries to post):**
```json
{
  "status": false,
  "message": "Only administrators can create newsfeed posts"
}
```

---

## 4. Edit a Post — Admin Only

```
PUT /api/posts/:postId
Authorization: Bearer <token>
Content-Type: application/json
```

All fields optional — only send what changed.

**Body:**
```json
{
  "title": "Updated Title",
  "body": "Updated content...",
  "category": "Industry Update"
}
```

**Response:**
```json
{
  "status": 200,
  "error": false,
  "message": "Post updated successfully"
}
```

---

## 5. Delete a Post — Admin Only

```
DELETE /api/posts/:postId
Authorization: Bearer <token>
```

Permanently deletes the post and all its likes and comments.

**Response:**
```json
{
  "status": 200,
  "error": false,
  "message": "Post deleted successfully"
}
```

---

## 6. Like / Unlike a Post — Toggle

```
POST /api/posts/:postId/like
Authorization: Bearer <token>
```

No body needed. If the user has already liked the post, it unlikes it. If not liked, it likes it.

**Response — liked:**
```json
{
  "status": 200,
  "error": false,
  "message": "Post liked",
  "data": {
    "liked": true,
    "likeCount": 25
  }
}
```

**Response — unliked:**
```json
{
  "status": 200,
  "error": false,
  "message": "Post unliked",
  "data": {
    "liked": false,
    "likeCount": 24
  }
}
```

---

## 7. Add a Comment

```
POST /api/posts/:postId/comment
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "comment": "This is amazing news!"
}
```

Max 1000 characters.

**Response (201):**
```json
{
  "status": 201,
  "error": false,
  "message": "Comment added successfully",
  "data": {
    "commentId": "cmt_xyz789",
    "comment": "This is amazing news!",
    "authorName": "John Doe",
    "createdAt": "2025-12-01 10:30:00"
  }
}
```

---

## 8. Get Comments on a Post

```
GET /api/posts/:postId/comments
Authorization: Bearer <token>
```

**Query params (optional):**

| Param | Description |
|---|---|
| `page` | Page number (default: 1) |
| `limit` | Comments per page (default: 20, max: 50) |

**Response:**
```json
{
  "status": 200,
  "error": false,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "commentId": "cmt_xyz789",
      "comment": "This is amazing news!",
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "profileImagePath": "https://...",
      "authorTitle": "Founder & CEO",
      "createdAt": "2025-12-01 10:30:00"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

## Summary — All Endpoints

| Method | URL | Who | Description |
|---|---|---|---|
| GET | `/api/posts` | All users | News feed with filters |
| GET | `/api/posts/:id` | All users | Single post for deep link |
| POST | `/api/posts` | Admin only | Create post |
| PUT | `/api/posts/:id` | Admin only | Edit post |
| DELETE | `/api/posts/:id` | Admin only | Delete post |
| POST | `/api/posts/:id/like` | All users | Like/unlike toggle |
| POST | `/api/posts/:id/comment` | All users | Add comment |
| GET | `/api/posts/:id/comments` | All users | Get comments |

---

## How to implement the share / deep link feature

When user taps "Copy Link":
1. Frontend constructs the link as: `https://yourapp.com/feed/{postId}`
2. When another user opens that link, frontend extracts `postId` from the URL
3. Frontend calls `GET /api/posts/{postId}` to load that specific post
4. Render the post in full view

The `postId` is always returned in the feed response so it is always available to construct the link.
