# Comprehensive Authentication & Onboarding Flow

## Overview & Context
This document outlines the end-to-end user creation, authentication, and onboarding flow for the STP Alumni application.
**CRITICAL CONTEXT:** This application is a **closed, secure platform strictly reserved for verified alumni of the school.** Public registration is completely disabled.

Accounts can only be provisioned by System Administrators. Users subsequently claim these pre-provisioned accounts via a generated temporary password and finalize their entry through a mandatory Profile Onboarding sequence.

---

## 1. The Core User Journeys

### Journey A: The "Request Access" Flow (For Uninvited Alumni)
If an alumnus navigates to the platform but does not have an account or an invitation, they cannot sign up directly.
1. **Request Submission:** The user navigates to a `Request Access` or `Contact Support` page.
2. **Provide Verification Credentials:** The user submits a form detailing their Name, Email, Graduation Year, Cohort, and any valid proof of alumni status (e.g., Student ID number).
3. **Admin Review:** Support/Admin staff review these credentials externally.
4. **Approval & Provisioning:** If verified, the Admin proceeds to **Journey B** below to manually provision their account.

### Journey B: The Admin Provisioning Flow
1. **Admin Creation:** An administrator logs into the backend Admin portal.
2. **Execute Provisioning:** The admin inputs the user's basic details (Email, First Name, Last Name) and executes the creation endpoint.
3. **Dispatch:** The backend securely generates a temporary password and dispatches an automated invitation email to the user containing these credentials.

### Journey C: The Platform Onboarding Flow (User Facing)
1. **Initial Login:** The invited user navigates to the platform's `/login` page and authenticates using their email and the temporary password.
2. **State Evaluation:** Upon login, the platform evaluates the user's state.
   - If `requiresPasswordChange === true`, divert to a Mandatory Password Update screen.
   - If `isOnboarded === false`, divert the user natively to the **Profile Setup** flow.
3. **Onboarding Submission:** The user completes their profile (sector, location, skills) via the Setup endpoint.
4. **Completion:** Upon successful submission, the system flips `isOnboarded` to `true` and the user is redirected into the `/dashboard`.

### Journey D: Profile Viewing & Restricted Management
1. **Access Profile:** The user navigates to their `/profile` or Settings page.
2. **Render Details:** The platform calls `GET /users/profile` to render their entire dataset (Name, Cohort, Sector, Location, etc.).
3. **Restricted Editing:** Because the user was globally admin-provisioned, core identity fields securely remain **read-only** (e.g., Email, Graduation Year, Cohort).
4. **Allowed Edits:** Users may only update dynamic fields like `skills`, `location`, `sector`, or `profileImage`.

---

## 2. Admin & Support Required API Endpoints

These endpoints define the requirements for the Backend team to build or maintain for the **Admin/Support staff**.

### 1. Request Access (Public Facing)
**Endpoint:** `POST /public/request-access`
**Purpose:** Allows uninvited alumni to submit their credentials for Admin review.
**Request Body (JSON):**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@alumni.edu",
  "cohortYear": "2020",
  "studentId": "STP-987654",
  "message": "I lost my original invite."
}
```
**Expected Response:**
```json
{
  "status": true,
  "message": "Access request submitted. Support will review your credentials."
}
```

### 2. Admin Creates User (Admin Restricted)
**Endpoint:** `POST /admin/users`
**Purpose:** An authorized admin provisions a new user account, triggering the backend to generate a temporary password and dispatch the invite email.
**Headers:** `Authorization: Bearer <AdminToken>`
**Request Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "role": "alumni"
}
```
**Expected Response:**
```json
{
  "status": true,
  "message": "User provisioned successfully. Invitation email dispatched."
}
```

---

## 3. Platform Required API Endpoints (The Alumni Codebase)

These endpoints dictate the exact configurations the Alumni codebase interacts with. **It is critical that the Backend attaches the specific `isOnboarded` state flags to control routing securely.**

### 1. Authentication (Login)
**Endpoint:** `POST /auth/login`
**Purpose:** Authenticate the user and determine their current onboarding state.
**Request Body (JSON):**
```json
{
  "email": "john.smith@example.com",
  "password": "temporary_password_123"
}
```
**Expected Response:**
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
      "id": "u-12345",
      "email": "john.smith@example.com",
      "isOnboarded": false,           // ← CRITICAL FLAG FOR ROUTING
      "requiresPasswordChange": true  // ← CRITICAL FLAG 
    }
  }
}
```

### 2. Change Temporary Password
**Endpoint:** `POST /auth/change-password`
**Purpose:** Allow the user to set a secure password mapping to `requiresPasswordChange`.
**Request Body (JSON):**
```json
{
  "oldPassword": "temporary_password_123",
  "newPassword": "SecureUserPassword!2026"
}
```

### 3. Profile Setup / Onboarding
**Endpoint:** `POST /users/profile/setup`
**Purpose:** Submit the user's onboarding details and toggle `isOnboarded` to true.
**Content-Type:** `multipart/form-data`
**Request Body (FormData):**
- `sector[]`, `location`, `skills[]`, `linkedInProfile`, `goals`, `cohort`, `profileImage` (File)
**Expected Response:**
```json
{
  "status": true,
  "message": "Profile setup completed successfully",
  "data": {
    "user": {
      "id": "u-12345",
      "isOnboarded": true  // ← MUST return true after this completes
    }
  }
}
```

### 4. Get Current User Profile
**Endpoint:** `GET /users/profile`
**Purpose:** Session persistence check on page reloads to prevent forced entries.
**Expected Response:**
```json
{
  "status": true,
  "data": {
    "id": "u-12345",
    "isOnboarded": false  // ← Crucial fallback check
  }
}
```

---

## 4. Platform Implementation Plan
With this specification passed to Backend:
1. We will establish a "Request Access" `/support` landing page locally.
2. We will purge the existing `/signup` user flow entirely from this codebase.
3. We will wrap the `/dashboard` route in a state guard to forcefully eject any user where `isOnboarded === false` into `/onboarding`.
4. We will build a dedicated `/profile` view page mapping the full `GET /users/profile` payload, explicitly locking the inputs for admin-controlled identity fields (Email, Cohort, etc.).
