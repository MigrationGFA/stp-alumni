# Messaging & Deal Room — Integration Plan

## Context

The backend exposes a **unified messaging API** under `/api/messaging/` with three conversation types:
- `DIRECT` — 1-to-1 chats (invitation-based)
- `PUBLIC_GROUP` — discoverable groups (open or closed join)
- `PRIVATE_GROUP` — hidden, invite-only deal rooms

The current frontend has **zero API integration**. Both `useMessaging.js` and `useDealRoom.js` are 100% mock data with `TODO: Backend call` comments. No `messagingService.js` exists.

### API Base Reference
All endpoints are under `{{baseUrl}}/api/messaging/`. Auth via `Bearer` token (already handled by `src/lib/api/axios.js` interceptor).

---

## Phase 1 — Service Layer & Store Foundation

**Goal:** Create the shared service and state infrastructure that both Messaging and Deal Room will consume.

### 1.1 Create `src/lib/services/messagingService.js`

A single service file covering every endpoint from the Postman collection:

```
DIRECT CHAT
  sendInvitation(recipientId, shortMessage)        POST   /messaging/direct/invite
  getPendingInvitations()                           GET    /messaging/direct/invitations
  respondToInvitation(invitationId, action)         POST   /messaging/direct/invitations/:id/respond
                                                          action: "accept" | "decline"

PUBLIC GROUPS
  createPublicGroup(formData)                       POST   /messaging/groups/public
                                                          formData: { name, description, isOpen: "1"|"0" }
  searchPublicGroups(params)                        GET    /messaging/groups/public?search=&page=&limit=
  joinGroup(groupId)                                POST   /messaging/groups/:id/join
  getJoinRequests(groupId)                          GET    /messaging/groups/:id/requests
  respondToJoinRequest(groupId, requestId, action)  POST   /messaging/groups/:id/requests/:reqId/respond
                                                          action: "approve" | "reject"
  updateGroupSettings(groupId, data)                PATCH  /messaging/groups/:id/settings
                                                          data: { name?, description?, isOpen? }

PRIVATE GROUPS (Deal Room)
  createPrivateGroup(formData)                      POST   /messaging/groups/private
                                                          formData: { name, description, memberLimit? }
  inviteToGroup(groupId, userId)                    POST   /messaging/groups/:id/invite
  removeMember(groupId, userId)                     POST   /messaging/groups/:id/members/remove
  updatePrivateGroupSettings(groupId, data)         PATCH  /messaging/groups/:id/settings
                                                          data: { name?, memberLimit? }

SHARED (all conversation types)
  getConversations()                                GET    /messaging/conversations
  getMessages(conversationId, params)               GET    /messaging/conversations/:id/messages?page=&limit=
  uploadMedia(conversationId, formData)             POST   /messaging/conversations/:id/media
                                                          formData: { mediaFile, content? }

DELETE
  deleteMessage(messageId)                          DELETE /messaging/messages/:messageId
```

### 1.2 Create `src/lib/store/useMessagingStore.js`

Zustand store to hold shared messaging state:

```
State:
  conversations: []          // All conversations (direct + public + private)
  activeConversationId: null
  messages: {}               // { [conversationId]: Message[] }
  invitations: []            // Pending direct chat invitations
  isLoading: boolean
  error: null

Computed (via selectors):
  directConversations        // conversations.filter(c => c.type === "DIRECT")
  publicGroupConversations   // conversations.filter(c => c.type === "PUBLIC_GROUP")
  privateGroupConversations  // conversations.filter(c => c.type === "PRIVATE_GROUP")

Actions:
  setConversations(data)
  setMessages(conversationId, messages)
  appendMessage(conversationId, message)
  removeMessage(conversationId, messageId)
  setActiveConversation(id)
  setInvitations(data)
  updateConversation(id, partial)
  addConversation(conversation)
  removeConversation(id)
```

### 1.3 Create `src/lib/hooks/useMessagingQueries.js`

React Query hooks wrapping the service layer:

```
useConversations()              — fetches GET /conversations, syncs to store
useMessages(conversationId)     — fetches GET /conversations/:id/messages, paginated
useSendInvitation()             — mutation for POST /direct/invite
useRespondToInvitation()        — mutation for POST /direct/invitations/:id/respond
usePendingInvitations()         — query for GET /direct/invitations
useSendMedia()                  — mutation for POST /conversations/:id/media
useDeleteMessage()              — mutation for DELETE /messages/:id
```

**Deliverables:** 3 new files. No UI changes. Everything testable via console/devtools.

---

## Phase 2 — Direct Messaging (Rewire Existing UI)

**Goal:** Replace mock data in the Messaging page with real API calls. Keep the existing UI components mostly intact.

### 2.1 Rewrite `useMessaging.js`

Replace the entire mock hook. The new version will:
- Call `useConversations()` and filter for `type === "DIRECT"` (and optionally `PUBLIC_GROUP`)
- Call `useMessages(activeConversationId)` for the selected conversation
- Use `useSendMedia()` for the send action (text messages go through the media endpoint with `content` only, or a dedicated send endpoint if the backend supports it — **NOTE: the Postman collection only shows media upload, not plain text send. Need to confirm with backend if text messages go through the same endpoint or a separate one.**)
- Use `useDeleteMessage()` for delete
- Handle optimistic updates via React Query's `onMutate`

### 2.2 Wire up Invitation Flow

The Postman collection shows direct chats require an invitation before messaging. This is a new UX flow that doesn't exist yet:

- Add an "Invite to Chat" button on user profiles / network cards
- When clicked → `sendInvitation(recipientId, shortMessage)`
- Show pending invitations in the conversation list (or a separate tab/section)
- Accept/decline actions → `respondToInvitation(invitationId, action)`
- On accept → new conversation appears in the list

**Where to surface invitations:**
- Option A: A badge/tab in the ConversationList header ("Invitations (3)")
- Option B: Inline in the conversation list with a distinct visual treatment
- Recommend Option A — keeps the list clean

### 2.3 Update `ConversationList.jsx`

- Remove mock data dependency
- Accept conversations from the rewritten hook
- Add invitations section/tab
- Map API response fields to existing component props (avatar, name, lastMessage, etc.)

### 2.4 Update `ChatView.jsx`

- Wire the Paperclip/Image buttons to `useSendMedia()` (file picker → upload)
- Wire the Send button to the text message endpoint
- Wire the Delete action to `useDeleteMessage()`
- Handle pagination (load more on scroll up)

### 2.5 Update `MessageBubble.jsx`

- Map API message shape to component props
- Handle `mediaUrl` field for image/document messages (render inline image or download link)

**Deliverables:** Rewritten `useMessaging.js`, updated `ConversationList`, `ChatView`, `MessageBubble`. Invitation UX added.

---

## Phase 3 — Deal Room (Rewire Existing UI)

**Goal:** Replace mock data in the Deal Room page with real API calls to the `PRIVATE_GROUP` endpoints.

### 3.1 Rewrite `useDealRoom.js`

Replace the entire mock hook. The new version will:
- Call `useConversations()` and filter for `type === "PRIVATE_GROUP"`
- Call `useMessages(activeRoomId)` for the selected room
- Wire `createRoom` → `messagingService.createPrivateGroup(formData)`
- Wire `addMember` → `messagingService.inviteToGroup(groupId, userId)`
- Wire `removeMember` → `messagingService.removeMember(groupId, userId)`
- Wire `updateRoomName` → `messagingService.updatePrivateGroupSettings(groupId, { name })`
- Wire `deleteRoom` — **NOTE: No delete room endpoint in the Postman collection. May need to confirm with backend or hide this action.**
- Wire `sendMessage` → media upload or text send endpoint
- Wire `deleteMessage` → `messagingService.deleteMessage(messageId)`

### 3.2 Update `CreateDealRoomModal.jsx`

Current 3-step wizard (name → members → documents) maps well to the API:
- Step 1 (Name): Captures `name` + `description` (add description field) + `memberLimit` (add field)
- Step 2 (Members): Currently searches by name string — needs to search real users. Wire to `networkService.getNetwork()` or a user search endpoint for autocomplete. Then call `inviteToGroup()` after room creation.
- Step 3 (Documents): Upload via `messagingService.uploadMedia(conversationId, formData)` after room is created.

**Important flow change:** The current modal creates the room and adds members in one shot (client-side). With the real API, the flow becomes:
1. `createPrivateGroup({ name, description, memberLimit })` → get `conversationId`
2. For each member: `inviteToGroup(conversationId, userId)`
3. For each document: `uploadMedia(conversationId, formData)`

This is sequential. The modal should show a progress state during steps 2-3.

### 3.3 Update `DealRoomList.jsx`

- Remove mock data dependency
- Accept rooms from the rewritten hook
- Map API response fields to existing component props

### 3.4 Update `DealRoomView.jsx`

- Wire member management (add/remove) to real API calls
- Wire settings update to `updatePrivateGroupSettings()`
- Wire media upload buttons
- Handle message pagination
- The "Documents" modal should list media messages of type document from the conversation history (or a dedicated endpoint if backend provides one)

**Deliverables:** Rewritten `useDealRoom.js`, updated `CreateDealRoomModal`, `DealRoomList`, `DealRoomView`.

---

## Phase 4 — Public Groups

**Goal:** Add the PUBLIC_GROUP feature which doesn't exist in the UI at all yet.

### 4.1 Decide Where Public Groups Live

Two options:
- **Option A:** Merge into the Messaging page — conversations list shows both direct chats and public groups, distinguished by an icon/badge. Group-specific actions (join, settings) appear contextually.
- **Option B:** Separate "Groups" section under messaging or network.

**Recommendation:** Option A. The API already returns all conversation types from `GET /conversations`. The ConversationList can show a type indicator (person icon vs. group icon). This matches how most chat apps work.

### 4.2 Build Group Discovery UI

- New "Browse Groups" button/section in the messaging page
- Calls `searchPublicGroups({ search, page, limit })`
- Shows group cards with name, description, member count, open/closed badge
- "Join" button for open groups → instant join
- "Request to Join" button for closed groups → pending state

### 4.3 Build Group Admin UI

For group creators/admins:
- "Group Settings" in the chat header dropdown (like Deal Room already has)
- Toggle `isOpen` (open/closed)
- Update name/description
- View and approve/reject join requests

### 4.4 Build Group Creation UI

- "Create Group" button in messaging
- Form: name, description, isOpen toggle
- Calls `createPublicGroup(formData)`

**Deliverables:** Group discovery UI, group creation modal, group admin settings, join request management.

---

## Phase 5 — Polish & Edge Cases

### 5.1 Real-time Updates
The current architecture is request-response only. For a chat app, this means:
- **Short-term:** Poll `GET /conversations` every 15-30 seconds for new messages. Poll active conversation messages more frequently (5-10 seconds).
- **Long-term:** WebSocket/SSE integration if backend supports it.

### 5.2 Error Handling
- 403 on non-member trying to access private group → redirect or show "Access Denied"
- 409 on duplicate invitation → show "Already invited" toast
- 400 on self-invite → show "Cannot invite yourself" toast
- 415 on unsupported file type → show "File type not supported" toast
- 401 → redirect to login (already handled by axios interceptor)

### 5.3 Optimistic Updates
- Send message → show immediately with "sending" status → update to "sent"/"delivered" on success → revert on failure
- Like/join/invite → update UI immediately → revert on error
- Delete message → remove from UI immediately → restore on error

### 5.4 Media Message Rendering
- Images: inline preview with lightbox on click
- Documents (PDF, DOCX, XLSX): file icon + filename + download link
- File size limits: images 5MB, documents 20MB (from Postman collection)

### 5.5 Pagination
- Message history: infinite scroll (load older messages on scroll up)
- Conversation list: likely paginated if the user has many conversations
- Public group search: paginated results

---

## Open Questions for Backend Team

1. **How do you send a plain text message?** The Postman collection only shows `POST /conversations/:id/media` with `mediaFile` + `content`. Is there a separate endpoint for text-only messages, or do we send to the media endpoint with just `content` and no file?

2. **What does the conversation object look like?** We need the exact shape of `GET /conversations` response to map to our UI. Specifically: does it include `type` ("DIRECT" | "PUBLIC_GROUP" | "PRIVATE_GROUP"), `lastMessage`, `unreadCount`, member list, etc.?

3. **What does a message object look like?** We need the exact shape from `GET /conversations/:id/messages`. Specifically: `messageId`, `senderId`, `senderName`, `senderAvatar`, `content`, `mediaUrl`, `mediaType`, `createdAt`, `status`.

4. **Is there a delete room/group endpoint?** The Postman collection doesn't include one. Can admins delete rooms?

5. **Is there a "leave group" endpoint?** For public groups, can a member leave? The Postman collection doesn't show this.

6. **Is there a "mark as read" endpoint?** Needed for unread counts.

7. **Is there a user search endpoint?** The Deal Room "invite member" flow needs to search users by name. Currently `networkService.getNetwork()` returns network users, but we may need a dedicated search.

---

## Execution Order Summary

| Phase | Scope | Dependencies | Estimated Effort |
|-------|-------|-------------|-----------------|
| **Phase 1** | Service + Store + Query hooks | None — pure infrastructure | Small |
| **Phase 2** | Direct Messaging rewire | Phase 1 + answers to Q1-Q3 | Medium |
| **Phase 3** | Deal Room rewire | Phase 1 + answers to Q1-Q4, Q7 | Medium |
| **Phase 4** | Public Groups (new feature) | Phase 1 + Phase 2 patterns | Medium-Large |
| **Phase 5** | Polish, real-time, edge cases | Phases 2-4 complete | Ongoing |

Phases 2 and 3 can run in parallel once Phase 1 is done. Phase 4 depends on patterns established in Phase 2.
