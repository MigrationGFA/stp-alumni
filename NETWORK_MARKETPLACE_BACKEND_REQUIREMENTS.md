# Backend Requirements: Network & Marketplace

## 1. Module Overview
This module governs how alumni discover each other, form connections, assemble into groups, and register for events. The backend must enforce **new administrative approval workflows** for both Groups and Events. Furthermore, it must expand the search capability and ensure privacy rules are applied to public connection views.

---

## 2. Connections & Marketplace Discovery

### A. Advanced Filtering, Search & Pagination
**Endpoint Affected:** `GET /connections/network` (or `GET /users/directory`)
- **Pagination (Industry Standard):** Must include `page` and `limit` query parameters. A raw `GET` of thousands of alumni will degrade performance.
- **Query capability expansion:** The backend must parse and apply filters for the following parameters:
  - `cohort` (e.g., "STP 2023", "STP 2022")
  - `sector` (e.g., "Fintech", "Agri-Tech")
  - `location` / `primaryMarket`
  - `expansionInterests` (e.g., filtering users who want to expand to "Nairobi")
- **Search Optimization:** It is highly recommended to use either PostgreSQL Full-Text Search or an indexing engine (like Elasticsearch/Meilisearch) for performant queries against tags.
- **DTO Construction (Marketplace Visibility):** The objects returned in the array must securely include the "Give and Get" tags defined during Profile Setup. The frontend cards rely on:
  - `business.companyName`, `business.elevatorPitch`, `business.sector`
  - `network.servicesOffered`, `network.servicesNeeded`

### B. View Connection Profiles - New UI
**Endpoint Affected:** `GET /users/:id/profile` (Public View)
- **Description:** Fetches the full-page summary (bio, business info, etc.) of an alumnus *before* connecting.
- **Privacy Logic Engine:** The backend must evaluate the target user's `contactVisibility` setting (defined during onboarding). 
  - If `contactVisibility === 'ADMIN_ONLY'` OR if there is no active `ACCEPTED` connection between the requester and the target: The backend **MUST strip/redact** direct contact properties (email, phone) from the response JSON.

### C. Connection Status Lifecycle (Extended for Edge Cases)
The `Connection` entity must track explicit states (`status`: `PENDING`, `ACCEPTED`, `IGNORED`).
- **Endpoints Needed:**
  - `POST /connections` (Send initial request)
  - `PUT /connections/:id/accept` (Approve request)
  - `PUT /connections/:id/ignore` (Dismiss request quietly without notifying sender)
  - **`DELETE /connections/:id` (Disconnect):** Industry standard to remove an already accepted connection.
  - **`POST /users/:id/block` (Safety/Block):** Critical privacy feature allowing a user to prevent another user from discovering or interacting with them via the directory.

---

## 3. Community Groups

### A. Back-Office Approval Logic & Privacy States
Groups can no longer be instantiated into the public feed instantly by users.
- **Schema Update:** Add a `status` column/property (`PENDING_APPROVAL`, `ACTIVE`, `REJECTED`).
- **Schema Update (Privacy):** Add `privacyMode` (`PUBLIC` vs `PRIVATE`). Public groups can be joined by anyone; Private groups require invite links or explicit Admin approval.
- **Creation (`POST /groups`):** When a standard user creates a group, its DB status must default to `PENDING_APPROVAL`.
- **Admin Activation (`PUT /admin/groups/:id/approve`):** Required endpoint for the Backoffice tools to flip the group to `ACTIVE`.

### B. Interaction & Management Fixes
- **Role Distinction:** The mapping table/collection joining Users to Groups (`GroupMember`) must structurally support a `role` enum (`ADMIN`, `MEMBER`).
- **Fetching Members (`GET /groups/:id/members`):** The response payload must cleanly separate or order the user array so the frontend can render Admins at the top of the list independently of regular members.
- **Member Ejection (`DELETE /groups/:id/members/:userId`):** Group Admins must have an endpoint to forcibly remove a user from the group.
- **Group Posting Auth:** Before fulfilling a `POST /posts` request that includes a `groupId`, the backend must actively query the `GroupMember` table to ensure the requester is an approved participant of that group.
- **Invite Links:**
  - `POST /groups/:id/invite-link`: Generates a secure, expiring cryptographic token pointing to the group.
  - `POST /groups/join-via-link`: Validates the token and adds the user to the `GroupMember` structure.

---

## 4. Events

### A. Back-Office Approval Logic & Logistics Limits
Similar to Groups, user-generated external or internal events require administrative vetting and logistical constraints.
- **Schema Update:** Add a `status` column/property (`PENDING_APPROVAL`, `ACTIVE`, `REJECTED`).
- **Schema Update (Logistics):** Add `capacity` (Integer) to cap registrations, and `isWaitlistEnabled` (Boolean).
- **Creation (`POST /events`):** Standard user creation forcibly defaults to `PENDING_APPROVAL`.
- **Admin Activation (`PUT /admin/events/:id/approve`):** Backoffice endpoint to activate the event, making it visible in the main calendar.

### B. Registration & 'My Events'
- **Registration (`POST /events/:id/register`):** 
  - *Logic Rule:* If current attendees < `capacity`, create `EventAttendee` mapping.
  - *Logic Rule:* If attendees >= `capacity`, and `isWaitlistEnabled === true`, flag the relation as `WAITLISTED`. Return an error if waitlists aren't enabled.
- **Cancellation (`DELETE /events/:id/register`):** Essential endpoint allowing users to withdraw their RSVP. The backend should automatically bump up the next `WAITLISTED` user if applicable.
- **Fetching User Events (`GET /events/mine`):** Must query strictly for `EventAttendee` records mapped to the user, returning the full augmented Event objects so the frontend can populate the "My Events" view.
