# Profile API

Base URL: `http://chitra-studio-api.test/api`

All protected endpoints require a Bearer token. See [Authentication](./auth.md).

---

## Get Profile

Returns the authenticated user's profile including role and associated studio.

**Endpoint:** `GET /api/user`

**Headers:**

| Header          | Value                         |
|-----------------|-------------------------------|
| Authorization   | `Bearer <token>`              |
| Accept          | `application/json`            |

**Success Response (200):**

```json
{
    "message": "Profile retrieved successfully.",
    "id": 1,
    "name": "Pratik Gautam",
    "email": "pratik@chitra.com",
    "role": "studio_owner",
    "role_label": "Studio Owner",
    "is_superadmin": false,
    "initials": "PG",
    "studio": {
        "id": 1,
        "name": "Chitra Studio Pokhara",
        "email": "pokhara@chitra.com",
        "phone": "9800000000",
        "address": "Lakeside, Pokhara",
        "subscription": {
            "cycle": "monthly",
            "cycle_label": "Monthly",
            "price_npr": 2500,
            "price_formatted": "NPR 2,500",
            "starts_at": "2026-04-13T00:00:00+05:45",
            "ends_at": "2026-05-13T00:00:00+05:45",
            "is_active": true
        },
        "access_enabled": true,
        "created_at": "2026-04-13T00:00:00+05:45",
        "updated_at": "2026-04-13T00:00:00+05:45"
    },
    "created_at": "2026-04-13T00:00:00+05:45",
    "updated_at": "2026-04-13T00:00:00+05:45"
}
```

**Superadmin Response (200) — no studio:**

```json
{
    "message": "Profile retrieved successfully.",
    "id": 2,
    "name": "Super Admin",
    "email": "super@chitra.com",
    "role": "superadmin",
    "role_label": "Superadmin",
    "is_superadmin": true,
    "initials": "SA",
    "studio": null,
    "created_at": "2026-04-13T00:00:00+05:45",
    "updated_at": "2026-04-13T00:00:00+05:45"
}
```

**Error Response (401) — Unauthenticated:**

```json
{
    "message": "Unauthenticated."
}
```

**Response Fields:**

| Field             | Type      | Description                                    |
|-------------------|-----------|------------------------------------------------|
| message           | string    | Success message                                |
| id                | int       | User ID                                        |
| name              | string    | User's full name                               |
| email             | string    | User's email address                           |
| role              | string    | Role enum: `superadmin` or `studio_owner`      |
| role_label        | string    | Human-readable role name                       |
| is_superadmin     | bool      | Whether the user is a superadmin               |
| initials          | string    | User's initials (e.g. "PG")                    |
| studio            | object|null| The user's associated studio (null if none)    |
| studio.id         | int       | Studio ID                                      |
| studio.name       | string    | Studio name                                    |
| studio.email      | string    | Studio contact email                           |
| studio.phone      | string    | Studio phone number                            |
| studio.address    | string    | Studio address                                 |
| studio.subscription| object   | Subscription details (see below)               |
| studio.access_enabled| bool   | Whether studio access is currently enabled     |
| created_at        | string    | ISO 8601 timestamp                             |
| updated_at        | string    | ISO 8601 timestamp                             |

**Subscription object** (inside `studio.subscription`):

| Field          | Type      | Description                                  |
|----------------|-----------|----------------------------------------------|
| cycle          | string    | `monthly` or `annually`                      |
| cycle_label    | string    | "Monthly" or "Annually"                      |
| price_npr      | int       | Price in NPR (paise-free integer)            |
| price_formatted| string    | Formatted price: "NPR 2,500"                 |
| starts_at      | string|null| ISO 8601 date                                |
| ends_at        | string|null| ISO 8601 date                                |
| is_active      | bool      | Whether subscription is currently active     |

---

## Usage

```javascript
// Example: Fetch profile
const response = await fetch('/api/user', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    }
});

const data = await response.json();
console.log(data.name);    // "Pratik Gautam"
console.log(data.role);    // "studio_owner"

if (data.studio) {
    console.log(data.studio.name);                   // "Chitra Studio Pokhara"
    console.log(data.studio.subscription.is_active); // true
}
```
