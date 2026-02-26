# Auth-JWT API Documentation

> **Version:** 1.0.0  
> **Last Updated:** February 26, 2026  
> **Authors:** HashimKaliyadan  
> **License:** MIT

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Register](#1-register-a-new-user)
  - [Login](#2-login--obtain-jwt-tokens)
  - [Token Refresh](#3-refresh-access-token)
  - [Profile](#4-get-user-profile)
- [Authentication Flow](#authentication-flow)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Changelog](#changelog)

---

## Overview

The Auth-JWT API provides a secure JSON Web Token (JWT) based authentication system built with Django REST Framework and SimpleJWT. It supports user registration, login, token management, and protected resource access.

### Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Backend       | Django 5.x + Django REST Framework |
| Auth          | SimpleJWT (JWT Token-based)       |
| Database      | SQLite (development)              |
| Frontend      | React 18.x                        |
| CORS          | django-cors-headers               |

---

## Getting Started

### Base URL

| Environment   | URL                            |
|---------------|--------------------------------|
| Development   | `http://localhost:8000/api/`    |
| Production    | _TBD_                          |

### Content Type

All requests and responses use **JSON** format:

```
Content-Type: application/json
```

### Prerequisites

- Python 3.10+
- Node.js 18+
- Django & required packages installed (`pip install -r requirements.txt`)

---

## Authentication

This API uses **JWT (JSON Web Token)** authentication via the `Authorization` header.

### Token Types

| Token     | Purpose                              | Lifetime  |
|-----------|--------------------------------------|-----------|
| `access`  | Used to authenticate API requests    | 5 minutes (default) |
| `refresh` | Used to obtain new access tokens     | 24 hours (default)  |

### How It Works

1. Client sends credentials to `/api/login/`
2. Server returns an `access` token and a `refresh` token
3. Client includes the access token in the `Authorization` header for all protected requests
4. When the access token expires, the client uses the refresh token to get a new one via `/api/token/refresh/`
5. When the refresh token expires, the user must log in again

### Using the Token

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## API Endpoints

### 1. Register a New User

Creates a new user account.

| Property       | Value                |
|----------------|----------------------|
| **Method**     | `POST`               |
| **URL**        | `/api/register/`     |
| **Auth**       | ❌ Not required       |
| **Content-Type** | `application/json` |

#### Request Body

| Field      | Type   | Required | Constraints                    | Description              |
|------------|--------|----------|--------------------------------|--------------------------|
| `username` | string | ✅ Yes   | Unique, max 150 chars          | Unique username          |
| `email`    | string | ✅ Yes   | Valid email format              | User's email address     |
| `password` | string | ✅ Yes   | Min 8 chars, not too common    | Password (write-only)    |

#### Password Validation Rules

Django enforces the following password requirements:
- Must not be too similar to the username or email
- Must be at least **8 characters** long
- Must not be a commonly used password (e.g., `password123`)
- Must not be entirely numeric

#### Example Request

```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "securePassword123"
  }'
```

#### Responses

**✅ 201 Created**

```json
{
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com"
}
```

> **Note:** The password is never returned in the response (write-only field).

**❌ 400 Bad Request** — Username already exists

```json
{
    "username": ["A user with that username already exists."]
}
```

**❌ 400 Bad Request** — Weak password

```json
{
    "password": [
        "This password is too short. It must contain at least 8 characters.",
        "This password is too common."
    ]
}
```

---

### 2. Login / Obtain JWT Tokens

Authenticates a user and returns a pair of JWT tokens.

| Property       | Value                |
|----------------|----------------------|
| **Method**     | `POST`               |
| **URL**        | `/api/login/`        |
| **Auth**       | ❌ Not required       |
| **Content-Type** | `application/json` |

#### Request Body

| Field      | Type   | Required | Description         |
|------------|--------|----------|---------------------|
| `username` | string | ✅ Yes   | Registered username |
| `password` | string | ✅ Yes   | User's password     |

#### Example Request

```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

#### Responses

**✅ 200 OK**

```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ 401 Unauthorized** — Invalid credentials

```json
{
    "detail": "No active account found with the given credentials"
}
```

#### Important Notes

- Store the `access` token securely (e.g., `localStorage` or `httpOnly` cookies)
- The `refresh` token should be stored separately and only used to get new access tokens
- Never expose tokens in URLs or client-side logs

---

### 3. Refresh Access Token

Returns a new access token using a valid refresh token. Use this when the access token expires.

| Property       | Value                    |
|----------------|--------------------------|
| **Method**     | `POST`                   |
| **URL**        | `/api/token/refresh/`    |
| **Auth**       | ❌ Not required           |
| **Content-Type** | `application/json`     |

#### Request Body

| Field     | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `refresh` | string | ✅ Yes   | The refresh token from login |

#### Example Request

```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Responses

**✅ 200 OK**

```json
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ 401 Unauthorized** — Token expired or invalid

```json
{
    "detail": "Token is invalid or expired",
    "code": "token_not_valid"
}
```

---

### 4. Get User Profile

Returns the authenticated user's profile information.

| Property       | Value                |
|----------------|----------------------|
| **Method**     | `GET`                |
| **URL**        | `/api/profile/`      |
| **Auth**       | ✅ **Required** (Bearer Token) |

#### Headers

| Header          | Value                    | Required |
|-----------------|--------------------------|----------|
| `Authorization` | `Bearer <access_token>`  | ✅ Yes   |

#### Example Request

```bash
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Responses

**✅ 200 OK**

```json
{
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com"
}
```

**❌ 401 Unauthorized** — Missing or invalid token

```json
{
    "detail": "Authentication credentials were not provided."
}
```

**❌ 401 Unauthorized** — Expired token

```json
{
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
        {
            "token_class": "AccessToken",
            "token_type": "access",
            "message": "Token is invalid or expired"
        }
    ]
}
```

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. REGISTER    POST /api/register/                              │
│     └─→ Returns: { id, username, email }                         │
│                                                                  │
│  2. LOGIN       POST /api/login/                                 │
│     └─→ Returns: { access, refresh }                             │
│                                                                  │
│  3. ACCESS DATA GET /api/profile/                                │
│     └─→ Header:  Authorization: Bearer <access_token>            │
│     └─→ Returns: { id, username, email }                         │
│                                                                  │
│  4. TOKEN EXPIRED                                                │
│     └─→ POST /api/token/refresh/ with { refresh }               │
│     └─→ Returns: { access }  (new access token)                  │
│                                                                  │
│  5. REFRESH EXPIRED                                              │
│     └─→ User must log in again (go to step 2)                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Name                  | Description                                          |
|-------------|----------------------|------------------------------------------------------|
| `200`       | OK                   | Request successful                                   |
| `201`       | Created              | Resource created successfully (e.g., registration)   |
| `400`       | Bad Request          | Validation errors (missing/invalid fields)           |
| `401`       | Unauthorized         | Invalid credentials or missing/expired token         |
| `403`       | Forbidden            | Authenticated but lacks permission                   |
| `404`       | Not Found            | Endpoint does not exist                              |
| `405`       | Method Not Allowed   | Wrong HTTP method (e.g., GET instead of POST)        |
| `500`       | Internal Server Error | Unexpected server error                             |

### Error Response Format

All error responses follow this general structure:

```json
{
    "field_name": ["Error message 1", "Error message 2"],
    "another_field": ["Error message"]
}
```

Or for authentication errors:

```json
{
    "detail": "Error description",
    "code": "error_code"
}
```

---

## Rate Limiting

> **Note:** Rate limiting is not currently configured. For production deployment, consider adding throttling via Django REST Framework:
>
> ```python
> REST_FRAMEWORK = {
>     'DEFAULT_THROTTLE_RATES': {
>         'anon': '20/minute',
>         'user': '60/minute',
>     }
> }
> ```

---

## API Quick Reference

| Method | Endpoint              | Auth Required | Description           |
|--------|-----------------------|---------------|-----------------------|
| POST   | `/api/register/`      | ❌ No          | Create new account    |
| POST   | `/api/login/`         | ❌ No          | Get JWT tokens        |
| POST   | `/api/token/refresh/` | ❌ No          | Refresh access token  |
| GET    | `/api/profile/`       | ✅ Yes         | Get user profile      |

---

## Changelog

### v1.0.0 — February 26, 2026

- ✅ User registration with validation
- ✅ JWT-based login (access + refresh tokens)
- ✅ Token refresh endpoint
- ✅ Protected profile endpoint
- ✅ CORS enabled for frontend integration
- ✅ React frontend with login, register, and profile pages
