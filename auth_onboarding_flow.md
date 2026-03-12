# Authentication & Onboarding Flow Document

## Overview
This document outlines the revised authentication and onboarding flow for the STP Alumni application. The application operates on an **invite-only / admin-provisioned** model. Public users cannot sign up independently. Instead, administrators create accounts, and users claim them via a temporary password, followed by a mandatory profile onboarding sequence.

---

## 1. User Journey

1. **Admin Creation**: An administrator creates a user account in the system backend.
2. **Email Invitation**: The system dispatches an email to the user containing their registered email address and a systematically generated temporary password.
3. **Initial Login**: The user navigates to the `/login` page and authenticates using the provided email and temporary password.
4. **State Evaluation**: Upon successful login, the application evaluates the user's state. 
   - If `requiresPasswordChange === true`, divert to a Update Password screen (Optional but recommended).
   - If `isOnboarded === false`, divert the user to the `/onboarding` (Profile Setup) flow.
   - If `isOnboarded === true`, divert the user directly to the `/dashboard`.
5. **Onboarding**: The user fills out their profile details (sector, skills, location, etc.). Upon successful submission, the `isOnboarded` flag is toggled to `true`.

---

## 2. Required API Endpoints & Schemas

To correctly handle this flow on the frontend, the Backend needs to expose the following endpoints and append specific state flags to the User payload.

### A. Authentication (Login)
**Endpoint:** `POST /auth/login`
**Purpose:** Authenticate the user and determine their current onboarding state.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "temporary_password_123"
}
```

**Expected Response (JSON):**
*CRITICAL:* The backend MUST return flags indicating the user's setup status.
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
      "id": "u-12345",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isOnboarded": false,           // ← CRITICAL FLAG FOR ROUTING
      "requiresPasswordChange": true  // ← CRITICAL FLAG (if enforcing temp password updates)
    }
  }
}
```

### B. Change Temporary Password (Recommended)
**Endpoint:** `POST /auth/change-password`
**Purpose:** Allow the user to set their own secure password after logging in with the temp password.

**Request Body (JSON):**
```json
{
  "oldPassword": "temporary_password_123",
  "newPassword": "SecureUserPassword!2026"
}
```

**Expected Response (JSON):**
```json
{
  "status": true,
  "message": "Password updated successfully"
}
```

### C. Profile Setup / Onboarding
*(Note: This endpoint definition already partially exists in our API documentation, but we need to ensure the backend updates the `isOnboarded` flag upon success).*

**Endpoint:** `POST /users/profile/setup`
**Purpose:** Submit the user's onboarding details.
**Content-Type:** `multipart/form-data`

**Request Body (FormData):**
- `sector[]` (Array of Strings)
- `location` (String)
- `skills[]` (Array of Strings)
- `linkedInProfile` (String)
- `goals` (String)
- `cohort` (String)
- `profileImage` (File)

**Expected Response (JSON):**
```json
{
  "status": true,
  "message": "Profile setup completed successfully",
  "data": {
    "user": {
      "id": "u-12345",
      "email": "user@example.com",
      "isOnboarded": true  // ← MUST return true after this completes
    }
  }
}
```

### D. Get Current User Profile (For persisted sessions)
**Endpoint:** `GET /users/profile`
**Purpose:** When the app reloads, fetch the user's data to know if they should be kicked back to onboarding.

**Expected Response (JSON):**
```json
{
  "status": true,
  "message": "Profile retrieved",
  "data": {
    "id": "u-12345",
    "email": "user@example.com",
    "isOnboarded": false  // ← MUST be present in the standard profile fetch
  }
}
```

---

## 3. Frontend Implementation Summary (For your context)
Once the backend implements the `isOnboarded` and `requiresPasswordChange` flags inside the `POST /auth/login` and `GET /users/profile` responses:
1. We will delete the `/signup` page routing entirely.
2. We will add a global route guard / middleware. If a user tries to access `/dashboard` but their `isOnboarded` flag is `false`, they will be force-redirected to `/onboarding`.
3. If they finish the `/onboarding` `POST` request, the app will update their local state to `isOnboarded: true` and push them to `/dashboard`.
