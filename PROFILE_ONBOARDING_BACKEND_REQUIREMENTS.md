# Backend Requirements: Profile Onboarding & Setup

## 1. Feature Overview
The `Profile Onboarding` feature is a 4-step wizard capturing both the **Individual Personal Profile** and the **Company Business Details** of the alumni. 
**CRITICAL CONTEXT:** This new flow is an *extension* of the existing onboarding data, not a replacement. All fields previously captured (`location`, `linkedInProfile`, `goals`, `cohort`) must continue being ingested and stored.

1. **The Basics:** Individual details (Name, Title, Headshot, Location, LinkedIn Profile).
2. **The Business:** Company specifics (Name, Sector [Array/String], Stage, Business Model, Elevator Pitch, Goals).
3. **The Network (Give & Get):** Tags categorizing up to 3 Services Offered and 3 Services Needed (This evolves the legacy `skills` array).
4. **Privacy:** Adjust contact info visibility.

Data from Step 2 and Step 3 automatically populate the user's networking card on the Marketplace.

---

## 2. Database Schema Modeling
To support this new flow, the `User`/`Profile` tables/documents must structurally accommodate both existing legacy fields and the new additions:

### A. Personal Details
- `firstName` (String) - Admin provisioned.
- `lastName` (String) - Admin provisioned.
- `title` (String) - User's job role.
- `location` (String) - *Legacy field preserved.*
- `linkedInProfile` (String) - *Legacy field preserved.*
- `profileImageUrl` (String) - URL pointing to cloud storage (e.g. S3).
- `cohort` / `cohortYear` / `cohortNode` (String) - Core STP identity filters. *Legacy field preserved.*

### B. Business/Entity Details
- `companyName` (String)
- `sector` (Array of Strings / String) - *Legacy field preserved (originally an array).*
- `elevatorPitch` (String) - 1-sentence descriptor.
- `goals` (String) - *Legacy field preserved.*
- `companyStage` (Enum or String: `1-10`, `10-50`, `50-200`, `200+`) - Brackets used for privacy.
- `businessModel` (Enum or String: `B2B`, `B2C`, `B2B2C`, `MARKETPLACE`, etc.)

### C. The Network (Give & Get)
This evolves the current freeform `skills` array into structured Marketplace filters mapping relational tags (e.g., Services or Product Niches).
- `servicesOffered` (Array of Strings/IDs, Max 3)
- `servicesNeeded` (Array of Strings/IDs, Max 3)
- *(Note: Ensure backward compatibility mapping logic if necessary for legacy `skills` data).*

### D. Privacy Settings
- `contactVisibility` (Enum: `ALL_ALUMNI`, `ADMIN_ONLY`) - Defaults to `ALL_ALUMNI`.

---

## 3. Required API Endpoints

### A. Process Onboarding Submission
- **Endpoint:** `POST /users/profile/setup`
- **Content-Type:** `multipart/form-data`
- **Description:** Captures all 4 steps at once. It must ingest the full expanded payload integrating both legacy fields and new ones. If successful, sets `user.isOnboarded = true`.
- **Expected Payload:**
  - `title`, `location`, `linkedInProfile`, `cohort`
  - `companyName`, `sector` (or `sector[]`), `elevatorPitch`, `goals`, `companyStage`, `businessModel`, `contactVisibility`
  - Arrays: `servicesOffered[]`, `servicesNeeded[]`
  - File: `profileImage`

### B. Fetch User Profile
- **Endpoint:** `GET /users/profile`
- **Description:** Must return grouped data separating personal from business, integrating all historical fields so the settings UI can hydrate.
- **Example Response Addition:**
  ```json
  {
    "personal": {
       "title": "CEO",
       "location": "Accra",
       "linkedInProfile": "https://linkedin.com...",
       "cohort": "STP 2022",
       "profileImageUrl": "...",
       "contactVisibility": "ALL_ALUMNI"
    },
    "business": {
       "companyName": "Acme Corp",
       "sector": ["Agri-Tech"],
       "companyStage": "10-50",
       "businessModel": "B2B",
       "elevatorPitch": "Democratizing agriculture.",
       "goals": "Scale to 5 countries by 2028."
    },
    "network": {
       "offers": ["Fundraising", "Strategic Planning"],
       "needs": ["Technical Co-founder"]
    }
  }
  ```

### C. Reference Metadata Endpoint (Optional but Recommended)
- **Endpoint:** `GET /metadata/services`
- **Description:** Returns the predefined list of services/product niches that populate the "Give and Get" dropdowns to ensure consistent, strict matching for the Marketplace.

---

## 4. Key Integration Rules
1. **Marketplace Synchronization:** The data points `servicesOffered` and `servicesNeeded` **MUST be indexed** and attached to the existing `GET /public/marketplace` endpoint. The entire purpose of this feature is generating structured filter tags so alumni can dynamically search the marketplace based on what peers offer or need.
2. **STP Identity Immutability:** Identity data (e.g., `cohortYear` and `Region/Node`) should be strictly **read-only** to the user and tied to what the Admin provisioned during account creation, but still parsed if transmitted in payloads or hydration calls.
