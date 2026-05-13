# Subscription API

Base URL: `http://chitra-studio-api.test/api`

All protected endpoints require a Bearer token. See [Authentication](./auth.md).

---

## Get Subscription

Returns the authenticated user's studio subscription details including status, remaining days, and last payment.

**Endpoint:** `GET /api/studio/subscription`

**Headers:**

| Header          | Value                         |
|-----------------|-------------------------------|
| Authorization   | `Bearer <token>`              |
| Accept          | `application/json`            |

**Success Response (200) — Active subscription:**

```json
{
    "message": "Subscription retrieved successfully.",
    "studio": {
        "id": 1,
        "name": "Chitra Studio Pokhara"
    },
    "subscription": {
        "cycle": "monthly",
        "cycle_label": "Monthly",
        "price_npr": 2500,
        "price_formatted": "NPR 2,500",
        "starts_at": "2026-04-13T00:00:00+05:45",
        "ends_at": "2026-05-13T00:00:00+05:45",
        "is_active": true,
        "access_enabled": true,
        "days_remaining": 25
    },
    "last_payment": {
        "id": 10,
        "amount_npr": 2500,
        "amount_formatted": "NPR 2,500",
        "subscription_cycle": "monthly",
        "subscription_cycle_label": "Monthly",
        "method": "cash",
        "method_label": "Cash",
        "status": "paid",
        "status_label": "Paid",
        "paid_at": "2026-04-13T00:00:00+05:45",
        "paid_at_formatted": "Apr 13, 2026",
        "covers_from": "2026-04-13T00:00:00+05:45",
        "covers_until": "2026-05-13T00:00:00+05:45",
        "reference": "PAY-001",
        "notes": "Monthly payment",
        "recorded_by": {
            "id": 2,
            "name": "Super Admin"
        },
        "created_at": "2026-04-13T00:00:00+05:45",
        "updated_at": "2026-04-13T00:00:00+05:45"
    },
    "payment_history_url": "http://chitra-studio-api.test/api/studio/payments"
}

```

**Success Response (200) — Expired subscription:**

```json
{
    "message": "Subscription retrieved successfully.",
    "studio": {
        "id": 1,
        "name": "Chitra Studio Pokhara"
    },
    "subscription": {
        "cycle": "monthly",
        "cycle_label": "Monthly",
        "price_npr": 2500,
        "price_formatted": "NPR 2,500",
        "starts_at": null,
        "ends_at": "2026-04-12T00:00:00+05:45",
        "is_active": false,
        "access_enabled": false,
        "days_remaining": -1
    },
    "last_payment": null,
    "payment_history_url": "http://chitra-studio-api.test/api/studio/payments"
}
```

**Error Response (404) — No studio associated:**

```json
{
    "message": "No studio is associated with your account."
}
```

**Response Fields:**

| Field                        | Type      | Description                                      |
|------------------------------|-----------|--------------------------------------------------|
| message                      | string    | Success message                                  |
| studio.id                    | int       | Studio ID                                        |
| studio.name                  | string    | Studio name                                      |
| subscription.cycle           | string    | `monthly` or `annually`                          |
| subscription.cycle_label     | string    | "Monthly" or "Annually"                          |
| subscription.price_npr       | int       | Subscription price in NPR                        |
| subscription.price_formatted | string    | Formatted price: "NPR 2,500"                     |
| subscription.starts_at       | string|null | ISO 8601 date when current cycle started         |
| subscription.ends_at         | string|null | ISO 8601 date when current cycle ends            |
| subscription.is_active       | bool      | Whether subscription is currently active         |
| subscription.access_enabled  | bool      | Whether studio access is enabled                 |
| subscription.days_remaining  | int|null  | Days until expiry (negative = expired)           |
| last_payment                 | object|null| Most recent paid payment (null if none)          |
| payment_history_url          | string    | URL to fetch full payment history                |

---

## Usage

```javascript
// Fetch subscription details
const response = await fetch('/api/studio/subscription', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    }
});

const data = await response.json();
const sub = data.subscription;

// Check subscription status for UI
if (sub.is_active) {
    showBadge('Active', 'green');
} else {
    showBadge('Expired', 'red');
    showRenewalPrompt();
}

// Days remaining indicator
if (sub.days_remaining <= 7 && sub.days_remaining > 0) {
    showWarning(`Your subscription expires in ${sub.days_remaining} days`);
}

// Last payment info
if (data.last_payment) {
    console.log(`Last paid: ${data.last_payment.amount_formatted} on ${data.last_payment.paid_at_formatted}`);
}
```
