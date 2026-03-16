# API Endpoints Documentation

## 1. User Module

### Profile Submodule

#### Profile Setup
- **URL:** `https://app.gfa-tech.com/stp/api/users/profile/setup`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body (FormData):**
| Key | Type | Example Value |
| --- | --- | --- |
| `sector[0]` | String | "Finance" |
| `sector[1]` | String | "Technology" |
| `location` | String | "Ghana" |
| `skills[0]` | String | "Writing" |
| `skills[1]` | String | "Leadership" |
| `linkedInProfile` | String | "https://ng.linkedin.com" |
| `goals` | String | "These are my goals." |
| `cohort` | String | "STF2026" |
| `profileImage` | File | `fileInput.files[0]` |

#### Get Profile
- **URL:** `https://app.gfa-tech.com/stp/api/users/profile`
- **Method:** `GET`

---

## 2. Public Module

#### Marketplace
- **URL:** `https://app.gfa-tech.com/stp/api/public/marketplace`
- **Method:** `GET`

**Query Parameters:**
| Parameter | Type | Example Value |
| --- | --- | --- |
| `sector` | String | "Finance" |
| `location` | String | "Ghana" |

---

## 3. Resources Module

#### Upload Resource
- **URL:** `https://app.gfa-tech.com/stp/api/resources`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body (FormData):**
| Key | Type | Example Value |
| --- | --- | --- |
| `title` | String | "Sample Guide" |
| `description` | String | "This is a sample guide description." |
| `category` | String | "Guide" |
| `resourceFile` | File | `fileInput.files[0]` |

#### Get Resources
- **URL:** `https://app.gfa-tech.com/stp/api/resources`
- **Method:** `GET`

**Query Parameters:**
| Parameter | Type | Example Value |
| --- | --- | --- |
| `category` | String | "guide" |
| `search` | String | "temp" |
| `fileType` | String | "txt" |
| `sortBy` | String | "newest" |

#### Download Resource
- **URL:** `https://app.gfa-tech.com/stp/api/resources/download/:resource_id` (e.g., `res_20260211110548_698c547ccbb155.93371331`)
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body (FormData):**
*(Note: The provided payload is identical to upload, which might be a typo in the original raw data, but it is documented as provided).*
| Key | Type | Example Value |
| --- | --- | --- |
| `title` | String | "Sample Guide" |
| `description` | String | "This is a sample guide description." |
| `category` | String | "Guide" |
| `resourceFile` | File | `fileInput.files[0]` |

---

## 4. Post Module

#### Create Post
- **URL:** `https://app.gfa-tech.com/stp/api/posts`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body (FormData):**
| Key | Type | Example Value |
| --- | --- | --- |
| `body` | String | "Billionaire investor Leon Cooperman warned..." |
| `postImage[0]` | File | `fileInput.files[0]` |
| `postImage[1]` | File | `fileInput.files[0]` |

#### Comment on a Post
- **URL:** `https://app.gfa-tech.com/stp/api/posts/:post_id/comment` (e.g., `1eb84be0-a107-4204...`)
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (JSON):**
```json
{
  "comment": "This is cool!"
}
```

#### Like/Unlike a Post
- **URL:** `https://app.gfa-tech.com/stp/api/posts/:post_id/like` (e.g., `fd26f717-ee33-42d6...`)
- **Method:** `POST`
- **Request Body:** None

#### Get Posts
- **URL:** `https://app.gfa-tech.com/stp/api/posts`
- **Method:** `GET`

#### Get Post Comments
- **URL:** `https://app.gfa-tech.com/stp/api/posts/comments/:post_id`
- **Method:** `GET`

#### Get My Posts
- **URL:** `https://app.gfa-tech.com/stp/api/posts/mine`
- **Method:** `GET`

---

## 5. Events Module

#### Create an Event
- **URL:** `https://app.gfa-tech.com/stp/api/events`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body (FormData):**
| Key | Type | Example Value |
| --- | --- | --- |
| `type` | String | "online" |
| `format` | String | "json" |
| `name` | String | "Create Event" |
| `timeZone` | String | "UTC" |
| `startTime` | String | "2023-04-01T00:00:00Z" |
| `endTime` | String | "2023-04-30T23:59:59Z" |
| `description` | String | "Create a new event" |
| `externalLink` | String | "https://example.com" |
| `address` | String | "123 Main St" |
| `venue` | String | "Main Hall" |
| `coverImage` | File | `fileInput.files[0]` |

#### Get Events
- **URL:** `https://app.gfa-tech.com/stp/api/events`
- **Method:** `GET`

#### Get an Event's Details
- **URL:** `https://app.gfa-tech.com/stp/api/events/:event_id` (e.g., `evt_8a19daf602f9282a6acb67350bcd48aa`)
- **Method:** `GET`

---

## 6. Groups Module

#### Create Group
- **URL:** `https://app.gfa-tech.com/stp/api/groups`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body (FormData):**
| Key | Type | Example Value |
| --- | --- | --- |
| `name` | String | "Design System Community" |
| `description` | String | "STP group description" |
| `thumbnail` | File | `fileInput.files[0]` |

#### Manage Group Members
- **URL:** `https://app.gfa-tech.com/stp/api/groups/:group_id/manage-members`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (JSON):**
```json
{
  "action": "ADD",
  "userId": "d89ad6c5-372b-4e08-b0ed-505e325cb8cc"
}
```

#### Join/Leave Group
- **URL:** `https://app.gfa-tech.com/stp/api/groups/:group_id/member`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (JSON):**
```json
{
  "action": "LEAVE",
  "userId": "d89ad6c5-372b-4e08-b0ed-505e325cb8cc"
}
```

#### Group Member Status
- **URL:** `https://app.gfa-tech.com/stp/api/groups/:group_id/member`
- **Method:** `GET`

#### Get Groups
- **URL:** `https://app.gfa-tech.com/stp/api/groups`
- **Method:** `GET`

---

## 7. Connections Module

#### Get Connections
- **URL:** `https://app.gfa-tech.com/stp/api/connections`
- **Method:** `GET`

#### Get Networks
- **URL:** `https://app.gfa-tech.com/stp/api/connections/network`
- **Method:** `GET`

**Query Parameters:**
| Parameter | Type | Example Value |
| --- | --- | --- |
| `search` | String | (empty) |
| `industry` | String | (empty) |
| `location` | String | (empty) |

#### Get Connected to a User
- **URL:** `https://app.gfa-tech.com/stp/api/connections`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (JSON):**
```json
{
  "connectedUserId": "5d80adbe-9957-4257-b3ad-a80d452cd1ee"
}
```

#### Accept Connection
- **URL:** `https://app.gfa-tech.com/stp/api/connections/:connection_id/accept`
- **Method:** `POST`
- **Request Body:** None
