# STP Messaging API — Frontend Reference

**Base URL:** `https://app.gfa-tech.com/stp/api/messaging`  
**All requests require:** `Authorization: Bearer <token>`  
**All bodies are JSON unless stated as multipart/form-data**

---

## Overview — How Messaging Works

## Summary — All 21 Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/direct/invite` | Send a direct chat invitation |
| `GET` | `/direct/invitations` | Get received pending invitations |
| `POST` | `/direct/invitations/:id/respond` | Accept or decline an invitation |
| `POST` | `/groups/public` | Create a public group |
| `GET` | `/groups/public` | List all public groups |
| `POST` | `/groups/:id/join` | Join / request to join a group |
| `GET` | `/groups/:id/requests` | Get pending join requests (admin only) |
| `POST` | `/groups/:id/requests/:rid/respond` | Approve or reject a join request |
| `PATCH` | `/groups/:id/settings` | Update group settings (admin only) |
| `POST` | `/groups/:id/leave` | Leave a group |
| `POST` | `/groups/private` | Create a private group |
| `POST` | `/groups/:id/invite` | Invite user to private group (admin only) |
| `POST` | `/groups/:id/members/remove` | Remove member (admin only) |
| `GET` | `/conversations` | List all my conversations |
| `GET` | `/conversations/:id` | Single conversation + full member list |
| `GET` | `/conversations/:id/messages` | Get paginated messages |
| `POST` | `/conversations/:id/messages` | Send a text message |
| `POST` | `/conversations/:id/media` | Upload and send a file/image |
| `POST` | `/conversations/:id/read` | Mark as read (reset unread count) |
| `DELETE` | `/messages/:id` | Delete a message |
| `DELETE` | `/conversations/:id` | Delete / leave a conversation |

---

There are three conversation types:

| Type | Description |
|---|---|
| `DIRECT` | One-on-one chat between two users |
| `PUBLIC_GROUP` | Open or approval-gated group anyone can discover and join |
| `PRIVATE_GROUP` | Invite-only group (deal rooms in messaging) |

**Flow for starting a direct chat:**
1. User A sends an invite → `POST /direct/invite`
2. User B sees it → `GET /direct/invitations`
3. User B accepts → `POST /direct/invitations/:id/respond` with `{ "action": "accept" }`
4. A `conversationId` is created — both users can now send messages

---

## DIRECT — Invitation Flow

### 1. Send a Direct Invite
```
POST /api/messaging/direct/invite
```
**Body:**
```json
{
  "recipientId": "uuid-of-target-user",
  "shortMessage": "Hey, I'd like to connect with you!"
}
```
**Response (201):**
```json
{ "data": { "invitationId": "uuid" } }
```
If a conversation already exists, returns `200` with the existing `conversationId`.

---

### 2. Get Pending Invitations
```
GET /api/messaging/direct/invitations
```
**Response:**
```json
{
  "data": [
    {
      "invitationId": "uuid",
      "shortMessage": "Hey!",
      "status": "pending",
      "senderUserId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "profileImagePath": "https://...",
      "createdAt": "2025-12-01 10:00:00"
    }
  ]
}
```

---

### 3. Respond to an Invitation
```
POST /api/messaging/direct/invitations/:invitationId/respond
```
**Body:**
```json
{ "action": "accept" }
```
| Value | Result |
|---|---|
| `accept` | Creates a DIRECT conversation, returns `conversationId` |
| `decline` | Declines the invitation |

**Response (accept):**
```json
{
  "message": "Invitation accepted. You can now chat.",
  "data": { "conversationId": "uuid" }
}
```

---

## PUBLIC GROUP

### 4. Create a Public Group
```
POST /api/messaging/groups/public
Content-Type: multipart/form-data
```
| Field | Required | Notes |
|---|---|---|
| `name` | ✅ | Group name |
| `isOpen` | ✅ | `1` = anyone can join, `0` = requires approval |
| `description` | ❌ | |
| `avatar` | ❌ | JPG/PNG/WEBP, max 2MB |

**Response (201):**
```json
{ "data": { "conversationId": "uuid" } }
```

---

### 5. List Public Groups
```
GET /api/messaging/groups/public?search=fintech&page=1&limit=20
```
**Response:**
```json
{
  "data": [
    {
      "conversationId": "uuid",
      "name": "Fintech Founders",
      "description": "For fintech startup founders",
      "avatarPath": "https://...",
      "isOpen": 1,
      "memberCount": 42,
      "isMember": false
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```
`isMember: true` means the logged-in user is already in this group.

---

### 6. Join a Public Group
```
POST /api/messaging/groups/:conversationId/join
```
No body needed.
- **`isOpen = 1`** → Joins immediately, returns `conversationId`
- **`isOpen = 0`** → Submits join request, returns `requestId`

---

### 7. Get Join Requests *(Group Admin only)*
```
GET /api/messaging/groups/:conversationId/requests
```
**Response:**
```json
{
  "data": [
    {
      "requestId": "uuid",
      "userId": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "profileImagePath": "https://...",
      "createdAt": "2025-12-01 10:00:00"
    }
  ]
}
```

---

### 8. Respond to a Join Request *(Group Admin only)*
```
POST /api/messaging/groups/:conversationId/requests/:requestId/respond
```
**Body:**
```json
{ "action": "approve" }
```
| Value | Result |
|---|---|
| `approve` | User is added to the group |
| `reject` | Request is rejected |

---

### 9. Update Group Settings *(Group Admin only)*
```
PATCH /api/messaging/groups/:conversationId/settings
Content-Type: multipart/form-data
```
All fields optional:

| Field | Notes |
|---|---|
| `name` | New group name |
| `description` | New description |
| `isOpen` | `1` or `0` — PUBLIC_GROUP only |
| `memberLimit` | PRIVATE_GROUP only |
| `avatar` | New group avatar file |

---

### 10. Leave a Group
```
POST /api/messaging/groups/:conversationId/leave
```
No body needed.

---

## PRIVATE GROUP (Deal Room in Messaging)

### 11. Create a Private Group
```
POST /api/messaging/groups/private
Content-Type: multipart/form-data
```
| Field | Required | Notes |
|---|---|---|
| `name` | ✅ | |
| `description` | ❌ | |
| `memberLimit` | ❌ | Max number of members |
| `avatar` | ❌ | JPG/PNG/WEBP |

**Response (201):**
```json
{ "data": { "conversationId": "uuid" } }
```

---

### 12. Invite a Member *(Group Admin only)*
```
POST /api/messaging/groups/:conversationId/invite
```
**Body:**
```json
{ "userId": "uuid-of-user-to-add" }
```

---

### 13. Remove a Member *(Group Admin only)*
```
POST /api/messaging/groups/:conversationId/members/remove
```
**Body:**
```json
{ "userId": "uuid-of-user-to-remove" }
```

---

## SHARED — Conversations & Messages

### 14. Get All My Conversations
```
GET /api/messaging/conversations
```
Returns all conversations sorted by most recently active.

**Response:**
```json
{
  "data": [
    {
      "conversationId": "uuid",
      "type": "DIRECT",
      "name": "John Doe",
      "avatarPath": "https://...",
      "memberCount": 2,
      "unreadCount": 3,
      "lastMessage": {
        "type": "text",
        "content": "See you tomorrow!",
        "senderId": "uuid",
        "createdAt": "2025-12-01 10:30:00"
      },
      "otherUser": {
        "userId": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    {
      "conversationId": "uuid",
      "type": "PUBLIC_GROUP",
      "name": "Fintech Founders",
      "avatarPath": "https://...",
      "memberCount": 42,
      "unreadCount": 0,
      "lastMessage": null,
      "otherUser": null
    }
  ]
}
```
- `otherUser` is only populated for `DIRECT` conversations
- For `DIRECT`, `name` and `avatarPath` are automatically set to the other user's details
- `lastMessage.content` for non-text shows `📎 Image` / `📎 File` etc.

---

### 15. Get Single Conversation
```
GET /api/messaging/conversations/:conversationId
```
Returns full details including complete member list and your role.

**Response:**
```json
{
  "data": {
    "conversationId": "uuid",
    "type": "PUBLIC_GROUP",
    "name": "Fintech Founders",
    "description": "For founders",
    "avatarPath": "https://...",
    "isOpen": 1,
    "memberLimit": null,
    "myRole": "admin",
    "members": [
      {
        "userId": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "profileImagePath": "https://...",
        "title": "CEO",
        "companyName": "PayAfrica",
        "role": "admin",
        "joinedAt": "2025-12-01"
      }
    ]
  }
}
```

---

### 16. Get Messages
```
GET /api/messaging/conversations/:conversationId/messages?page=1&limit=30
```
Returns paginated messages, newest first.

**Response:**
```json
{
  "data": [
    {
      "messageId": "uuid",
      "conversationId": "uuid",
      "senderId": "uuid",
      "senderName": "John Doe",
      "senderAvatar": "https://...",
      "type": "text",
      "content": "Hello everyone!",
      "mediaUrl": null,
      "isDeleted": false,
      "createdAt": "2025-12-01 10:00:00"
    }
  ],
  "meta": { "page": 1, "limit": 30, "total": 150, "totalPages": 5 }
}
```
Message `type` values: `text`, `image`, `file`, `video`

---

### 17. Send a Text Message
```
POST /api/messaging/conversations/:conversationId/messages
```
**Body:**
```json
{ "content": "Hello everyone!" }
```
**Response (201):**
```json
{
  "data": {
    "messageId": "uuid",
    "content": "Hello everyone!",
    "type": "text",
    "createdAt": "2025-12-01 10:30:00"
  }
}
```

---

### 18. Upload and Send Media
```
POST /api/messaging/conversations/:conversationId/media
Content-Type: multipart/form-data
```
| Field | Notes |
|---|---|
| `file` | Image, PDF, doc, etc. Max 10MB |
| `type` | `image`, `file`, or `video` |

**Response (201):**
```json
{
  "data": {
    "messageId": "uuid",
    "type": "image",
    "mediaUrl": "https://...",
    "createdAt": "2025-12-01 10:30:00"
  }
}
```

---

### 19. Mark Conversation as Read
```
POST /api/messaging/conversations/:conversationId/read
```
No body needed. Resets `unreadCount` to `0` for this conversation.

**Call this every time the user opens a conversation.**

---

### 20. Delete a Message
```
DELETE /api/messaging/messages/:messageId
```
Soft-deletes the message. Only the sender can delete their own messages.

---

### 21. Delete / Leave a Conversation
```
DELETE /api/messaging/conversations/:conversationId
```
- For `DIRECT` → removes conversation from the user's list
- For groups → removes user from the group (same as leave)


---

## Role System (Groups only)

| Role | Can Do |
|---|---|
| `admin` | Update settings, approve join requests, invite members, remove members |
| `member` | Send messages, leave the group |

The user who creates a group is automatically the `admin`.
