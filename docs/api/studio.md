# Studio API

Base URL: `http://chitra-studio-api.test/api`

All protected endpoints require a Bearer token. See [Authentication](./auth.md).

---

## Get Studio

Returns the authenticated user's studio details with subscription info and payment summary.

**Endpoint:** `GET /api/studio`

**Headers:**

| Header          | Value                         |
|-----------------|-------------------------------|
| Authorization   | `Bearer <token>`              |
| Accept          | `application/json`            |

**Success Response (200):**

```json
{
    "message": "Studio retrieved successfully.",
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
    "owner": {
        "id": 1,
        "name": "Studio Owner",
        "email": "owner@chitra.com",
        "role": "studio_owner",
        "role_label": "Studio Owner",
        "is_superadmin": false,
        "initials": "SO",
        "studio": null,
        "created_at": "2026-04-13T00:00:00+05:45",
        "updated_at": "2026-04-13T00:00:00+05:45"
    },
    "payment_summary": 25000,
    "payment_count": 10,
    "created_at": "2026-04-13T00:00:00+05:45",
    "updated_at": "2026-04-13T00:00:00+05:45"
}
```

**Error Response (404) — No studio associated:**

```json
{
    "message": "No studio is associated with your account."
}
```

**Error Response (401) — Unauthenticated:**

```json
{
    "message": "Unauthenticated."
}
```

**Response Fields:**

| Field                  | Type      | Description                                    |
|------------------------|-----------|------------------------------------------------|
| message                | string    | Success message                                |
| id                     | int       | Studio ID                                      |
| name                   | string    | Studio name                                    |
| email                  | string    | Studio contact email                           |
| phone                  | string    | Studio phone number                            |
| address                | string    | Studio physical address                        |
| subscription           | object    | Current subscription details (see below)       |
| access_enabled         | bool      | Whether studio access is enabled               |
| owner                  | object    | Studio owner user profile                      |
| payment_summary        | int|null  | Total amount collected across all payments     |
| payment_count          | int|null  | Total number of payments                       |
| created_at             | string    | ISO 8601 timestamp                             |
| updated_at             | string    | ISO 8601 timestamp                             |

**Subscription object:**

| Field          | Type      | Description                                  |
|----------------|-----------|----------------------------------------------|
| cycle          | string    | `monthly` or `annually`                      |
| cycle_label    | string    | "Monthly" or "Annually"                      |
| price_npr      | int       | Price in NPR                                 |
| price_formatted| string    | Formatted price: "NPR 2,500"                 |
| starts_at      | string|null| ISO 8601 date when subscription starts       |
| ends_at        | string|null| ISO 8601 date when subscription ends         |
| is_active      | bool      | Whether the subscription is currently active |

---

## Usage

```javascript
// Fetch studio details
const response = await fetch('/api/studio', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    }
});

const data = await response.json();

// Display subscription status
console.log(data.subscription.is_active);            // true/false
console.log(data.subscription.price_formatted);      // "NPR 2,500"
console.log(data.subscription.cycle_label);          // "Monthly"

// Display owner info
console.log(data.owner.name);                        // "Studio Owner"
console.log(data.owner.email);                       // "owner@chitra.com"
```
