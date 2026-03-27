# Backend Requirements: Settings & Profile Management

## 1. Module Overview
This module governs how users actively maintain their professional identity post-onboarding, as well as their application preferences (Language, Theme, Notifications). The critical architectural focus here is **Immutability**—ensuring core Stanford identity data cannot be altered by the user once provisioned by an Admin.

---

## 2. Database Schema Modifications

### A. Application Preferences
The `User` or an attached `Settings` entity must be extended to persistently store the user's localized preferences.
- `language` (Enum: `EN`, `FR`) - Defaults to `EN`.
- `theme` (Enum: `LIGHT`, `DARK`, `SYSTEM`) - Defaults to `SYSTEM` or `LIGHT`.
- `emailNotificationsEnabled` (Boolean) - Defaults to `true`.

---

## 3. Required API Endpoints & Logic

### A. Updating the Profile (Split Editing)
- **Endpoint:** `PUT /users/profile`
- **UI Logic Mapping:** The endpoint must accept the split `personal` and `business` JSON data structure established during the `GET /users/profile` flow. This enables the frontend to submit isolated updates depending on which settings tab the user is interacting with.
- **CRITICAL: Strict Immutability Rule:** The backend API MUST strictly sanitize incoming payloads. If a malicious or erroneous request attempts to modify core identity attributes like `cohort`, `cohortYear`, `cohortNode`, `firstName`, or `lastName`, the backend must either silently strip/ignore these fields from the update SQL/query OR throw a `400 Bad Request` explicitly stating those specific fields are immutable.
- **Example Allowed Payload Edit:**
  ```json
  {
    "personal": {
      "title": "Senior Partner",
      "location": "Lagos",
      "linkedInProfile": "https://linkedin.com/..."
    },
    "business": {
      "elevatorPitch": "Investing in the future.",
      "companyStage": "50-200"
    }
  }
  ```

### B. Updating Fast Preferences
- **Endpoint:** `PUT /users/preferences`
- **Description:** A lightweight, highly responsive endpoint specifically for updating app settings without passing the heavier full profile data structure.
- **Expected Payload:**
  ```json
  {
    "language": "FR",
    "theme": "DARK",
    "emailNotificationsEnabled": false
  }
  ```
- **Backend Email Sync Note:** The `language` setting updated via this endpoint must immediately dictate what locale/template the backend subsequently uses when dispatching automated transactional emails (like Event reminders or Connection requests) to this user.

### C. Account Deactivation (Industry Standard)
- **Endpoint:** `DELETE /users/me`
- **Description:** For GDPR and general App Store privacy compliance, users must have a way to leave the ecosystem.
- **Backend Logic:** The backend should **soft-delete** the user. This means anonymizing or scrambling their personal Profile info so they disappear from the Marketplace and directory, but preserving the integrity of their historical generic posts/comments (perhaps re-rendering their name as "Deleted User").
