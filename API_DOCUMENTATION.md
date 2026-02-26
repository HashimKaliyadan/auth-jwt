# API Documentation

Base URL: `http://localhost:8000/api/`

---

## 1. Register a New User

**Endpoint:** `POST /api/register/`

**Description:** Creates a new user account. No authentication required.

**Request Body:**

| Field      | Type   | Required | Description              |
|------------|--------|----------|--------------------------|
| `username` | string | Yes      | Unique username          |
| `email`    | string | Yes      | User's email address     |
| `password` | string | Yes      | Password (write-only)    |

**Example Request:**

```json
POST /api/register/
Content-Type: application/json

{
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "securePassword123"
}
```

**Success Response (201 Created):**

```json
{
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com"
}
```

**Error Response (400 Bad Request):**

```json
{
    "username": ["A user with that username already exists."]
}
```

---

## 2. Login (Obtain JWT Tokens)

**Endpoint:** `POST /api/login/`

**Description:** Authenticates a user and returns a pair of JWT tokens (access + refresh). No authentication required.

**Request Body:**

| Field      | Type   | Required | Description         |
|------------|--------|----------|---------------------|
| `username` | string | Yes      | Registered username |
| `password` | string | Yes      | User's password     |

**Example Request:**

```json
POST /api/login/
Content-Type: application/json

{
    "username": "johndoe",
    "password": "securePassword123"
}
```

**Success Response (200 OK):**

```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**

```json
{
    "detail": "No active account found with the given credentials"
}
```

**Token Usage:**

Store the `access` token and include it in the `Authorization` header for all protected requests:

```
Authorization: Bearer <access_token>
```

---

## 3. Refresh Access Token

**Endpoint:** `POST /api/token/refresh/`

**Description:** Returns a new access token using a valid refresh token. Use this when the access token expires.

**Request Body:**

| Field     | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `refresh` | string | Yes      | The refresh token from login |

**Example Request:**

```json
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**

```json
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**

```json
{
    "detail": "Token is invalid or expired",
    "code": "token_not_valid"
}
```

---

## 4. Get User Profile

**Endpoint:** `GET /api/profile/`

**Description:** Returns the authenticated user's profile information. **Requires a valid JWT access token.**

**Headers:**

| Header          | Value                    | Required |
|-----------------|--------------------------|----------|
| `Authorization` | `Bearer <access_token>`  | Yes      |

**Example Request:**

```
GET /api/profile/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**

```json
{
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com"
}
```

**Error Response (401 Unauthorized):**

```json
{
    "detail": "Authentication credentials were not provided."
}
```

---

## Authentication Flow

```
1. User registers      →  POST /api/register/
2. User logs in         →  POST /api/login/         →  Receives access + refresh tokens
3. User accesses data   →  GET  /api/profile/        →  Sends access token in header
4. Token expires        →  POST /api/token/refresh/  →  Gets new access token
5. Refresh expires      →  User must log in again
```

## Error Codes Summary

| Status Code | Meaning                                      |
|-------------|----------------------------------------------|
| 200         | Success                                      |
| 201         | Created (registration successful)            |
| 400         | Bad Request (validation errors)              |
| 401         | Unauthorized (invalid credentials or token)  |
