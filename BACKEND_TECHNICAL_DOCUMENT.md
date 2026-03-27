# STP Alumni Platform - Comprehensive Backend Specification

## 1. Executive Summary & Architecture
The Seed Transformation Program (STP) Alumni Platform is a closed, headless networking environment. The backend acts as a RESTful API powering a Next.js frontend, emphasizing **administrative control**, **business-focused networking**, and **data privacy**. 

### Critical System Rules
1. **Closed Ecosystem:** Public registration is disabled. All accounts are strictly Admin-provisioned.
2. **Identity Immutability:** Core identifiers (`cohortYear`, `region/node`, `firstName`, `lastName`) are provisioned by the Admin. The backend must strictly reject user attempts to alter these fields later.
3. **Role-Based Access Control (RBAC):** Crucial actions like creating Newsfeed posts, approving Groups, and activating Events are hard-locked to the `Admin` role.

---

## 2. Phase 1: Authentication & Onboarding Flow

*The chronological sequence of how an alumnus gains access and sets up their professional presence.*

### A. Account Provisioning
1. **Creation:** An Admin hits `POST /admin/users` to create an alumni account.
2. **Dispatch:** The backend generates a temporary password, sets `requiresPasswordChange = true` and `isOnboarded = false`, and dispatches an invite email.

### B. Login & Authentication
1. **Authentication (`POST /auth/login`):** The user authenticates with their temporary credentials. The backend issues a JWT token and returns the `requiresPasswordChange` and `isOnboarded` flags to direct frontend routing.
2. **Password Update (`POST /auth/change-password`):** Required flow to secure the account, subsequently setting `requiresPasswordChange = false`.

### C. The 4-Step Profile Wizard
Instead of a giant form, onboarding captures the user's "Entity" (Individual + Business) and prepares them for the Marketplace.
- **Endpoint:** `POST /users/profile/setup` (multipart/form-data)
- **Data Ingestion Rules:** Must comprehensively ingest both legacy fields AND new fields.
  - *Personal:* `title`, `location`, `linkedInProfile`, `goals`, `cohort`, `profileImage`
  - *Business:* `companyName`, `sector`, `elevatorPitch`, `companyStage`, `businessModel`
  - *Give & Get:* `servicesOffered[]`, `servicesNeeded[]` (replaces legacy freeform `skills`)
  - *Privacy:* `contactVisibility` (Enum)
- **Completion:** Upon successful ingestion, the backend forcefully sets `user.isOnboarded = true`.

---

## 3. Phase 2: Marketplace Discovery & Connections

*How alumni find each other and establish direct professional relationships.*

### A. The Network Directory
- **Endpoint:** `GET /connections/network`
- **Logic Constraints:** 
  - Must support standard Pagination (`page`, `limit`).
  - Must parse advanced filters (`cohort`, `sector`, `primaryMarket`, `expansionInterests`).
  - **DTO Requirement:** To power the Marketplace UI, the array of returned users MUST be augmented with their Business data (`companyName`, `elevatorPitch`) and their Marketplace tags (`servicesOffered`, `servicesNeeded`).

### B. Profile Views & Privacy Redaction
- **Endpoint:** `GET /users/:id/profile`
- **Logic Constraints:** The backend must actively evaluate the target user's `contactVisibility` setting. If the requester has not achieved an `ACCEPTED` connection with the target, OR if visibility is set to `ADMIN_ONLY`, the backend must strictly strip direct contact parameters (email, phone) from the response JSON.

### C. Connection Lifecycle
- **Endpoints:** The `Connection` relational table tracks `requesterId`, `receiverId`, and `status`.
  - `POST /connections` (Send Invite)
  - `PUT /connections/:id/accept` (Approve Invite)
  - `PUT /connections/:id/ignore` (Quietly dismiss Invite)
  - `DELETE /connections/:id` (Remove an active connection)
  - `POST /users/:id/block` (Prevent future discovery/interaction)

---

## 4. Phase 3: Community Engagement (Groups, Events, Feed)

*How alumni interact with authoritative content and niche communities.*

### A. The Authoritative Newsfeed
- **Restricted Creation:** `POST /posts` must rigorously decode the JWT. If `role !== 'admin'`, forcibly return `403 Forbidden`.
- **Intelligent Fetching (`GET /posts`):** Must support pagination, text search (`?search=Keyword`), and category filtering (`?category=XYZ`).
- **Deep Linking (`GET /posts/:id`):** Must retrieve single enriched Post DTOs (including dynamic comment/like counts) to support direct link sharing.
- **Engagement (Public):** `POST /posts/:id/like` and `POST /posts/:id/comment` operate normally for all authenticated users.

### B. Community Groups
- **Admin Vetting Workflow:** User-submitted groups (`POST /groups`) must default to `PENDING_APPROVAL` status in the DB. They do not appear in discovery until an Admin hits `PUT /admin/groups/:id/approve`.
- **Privacy Core:** `privacyMode` (`PUBLIC` vs `PRIVATE`).
- **Group Mechanics:** 
  - `GroupMember` maps `role` (`ADMIN` vs `MEMBER`). 
  - Group Admins possess the authority to evict users (`DELETE /groups/:id/members/:userId`).
  - Standard endpoints generation/validation for expiring invite links.
  - `POST /posts` requests targeting a specific `groupId` must be verified against the `GroupMember` table to ensure the poster is an active, accepted participant of that group.

### C. Logistics-Driven Events
- **Admin Vetting Workflow:** Similar to Groups, `POST /events` forcefully defaults to `PENDING_APPROVAL` until Admin activation.
- **Capacity & Registration (`POST /events/:id/register`):**
  - Registration must be hard-capped by the event `capacity` Integer.
  - If capacity is hit and `isWaitlistEnabled === true`, the backend provisions a `WAITLISTED` attendee record.
  - Must robustly support `DELETE /events/:id/register` (Cancellation), triggering the backend to automatically promote the next waitlisted user into an active RSVP.

---

## 5. Phase 4: Maintenance (Settings & Operations)

*How users interact with administrative settings over their ecosystem lifecycle.*

### A. Persistent Profile Immutability
- **Endpoint:** `PUT /users/profile`
- **Logic Mapping:** Must accept payload updates partitioned into `personal` vs `business` JSON structures.
- **Constraint Rule:** The backend must strip or throw a 400 error if standard users attempt to modify locked Admin variables (`cohort`, `cohortYear`, `firstName`, `lastName`).

### B. Rapid Preferences Update
- **Endpoint:** `PUT /users/preferences`
- **Logic Mapping:** A lightweight endpoint scaling localized settings like `language`, `theme`, and `emailNotificationsEnabled`. The `language` setting here must govern the localization library used when the backend subsequently dispatches automated transactional emails to the user.

### C. Account Deactivation
- **Endpoint:** `DELETE /users/me`
- **Logic Mapping:** For privacy compliance, this triggers a **soft-delete**. The backend scrambles/masks their profile from the Marketplace and connection directories, yet preserves the referential integrity of their historical community posts and comments by rendering their author block as "Deleted User".
