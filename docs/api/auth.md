# Authentication API

Base URL: `http://chitra-studio-api.test/api`

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJ0eXAiOiJKV1Qi...
```

---

## Login

Authenticates a user and returns an access token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**

| Field    | Type   | Required | Description  |
|----------|--------|----------|--------------|
| email    | string | yes      | User's email |
| password | string | yes      | User's password |

**Example Request:**

```json
{
    "email": "admin@example.com",
    "password": "secret123"
}
```

**Success Response (200):**

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "superadmin"
    }
}
```

| Field        | Type   | Description                                        |
|--------------|--------|----------------------------------------------------|
| token        | string | Passport personal access token (JWT)               |
| user.id      | int    | User ID                                            |
| user.name    | string | User's full name                                   |
| user.email   | string | User's email address                               |
| user.role    | string | User role: `superadmin` or `studio_owner`          |

**Error Response (401) — Invalid credentials:**

```json
{
    "message": "Invalid email or password."
}
```

**Error Response (422) — Validation error:**

```json
{
    "message": "The email field is required. (and 1 more error)",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

**Error Response (429) — Rate limited:**

```json
{
    "message": "Too Many Attempts."
}
```

---

## Forgot Password

Sends a password reset link to the user's email. Always returns the same response regardless of whether the email exists (do not attempt to check if an email is registered).

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**

| Field | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| email | string | yes      | User's email address  |

**Example Request:**

```json
{
    "email": "admin@example.com"
}
```

**Success Response (200):**

```json
{
    "message": "If that email is registered, you will receive a password reset link."
}
```

**Error Response (422) — Validation error:**

```json
{
    "message": "The email field is required.",
    "errors": {
        "email": ["The email field is required."]
    }
}
```

**Error Response (429) — Rate limited:**

```json
{
    "message": "Too Many Attempts."
}
```

---

## Rate Limiting

| Endpoint        | Limit                     |
|-----------------|---------------------------|
| Login           | 5 requests per minute     |
| Forgot Password | 3 requests per minute     |

Rate limits are keyed by email address, falling back to IP address.

---

## Usage Flow

1. **Login** — Call `POST /api/auth/login` with email and password
2. **Store token** — Save the `token` value from the response (e.g., in localStorage)
3. **Authenticate requests** — Include the token in the `Authorization: Bearer <token>` header for all protected API calls
4. **Token expiry** — Tokens expire after **6 months**. The user will need to log in again after expiry.
5. **Forgot password** — Call `POST /api/auth/forgot-password` with the user's email to trigger a password reset email
