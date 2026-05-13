# Payments API

Base URL: `http://chitra-studio-api.test/api`

All protected endpoints require a Bearer token. See [Authentication](./auth.md).

---

## Get Payment History

Returns a paginated list of payments for the authenticated user's studio.

**Endpoint:** `GET /api/studio/payments`

**Headers:**

| Header          | Value                         |
|-----------------|-------------------------------|
| Authorization   | `Bearer <token>`              |
| Accept          | `application/json`            |

**Query Parameters:**

| Parameter   | Type   | Required | Default  | Description                                    |
|-------------|--------|----------|----------|------------------------------------------------|
| per_page    | int    | no       | 15       | Results per page (max 100)                     |
| page        | int    | no       | 1        | Page number                                    |
| sort        | string | no       | paid_at  | Sort field: `paid_at`, `amount_npr`, `created_at` |
| direction   | string | no       | desc     | Sort direction: `asc` or `desc`                |
| status      | string | no       | —        | Filter by status: `paid`, `pending`, `failed`  |
| method      | string | no       | —        | Filter by method: `cash`, `bank_transfer`, `esewa`, `khalti`, `other` |
| from        | date   | no       | —        | Filter payments from this date (Y-m-d)         |
| until       | date   | no       | —        | Filter payments until this date (Y-m-d)        |

**Success Response (200):**

```json
{
    "message": "Payments retrieved successfully.",
    "studio": {
        "id": 1,
        "name": "Chitra Studio Pokhara"
    },
    "payments": [
        {
            "id": 10,
            "amount_npr": 5000,
            "amount_formatted": "NPR 5,000",
            "subscription_cycle": "annually",
            "subscription_cycle_label": "Annually",
            "method": "bank_transfer",
            "method_label": "Bank transfer",
            "status": "paid",
            "status_label": "Paid",
            "paid_at": "2026-05-01T00:00:00+05:45",
            "paid_at_formatted": "May 1, 2026",
            "covers_from": "2026-05-01T00:00:00+05:45",
            "covers_until": "2027-05-01T00:00:00+05:45",
            "reference": "BTX-2026-001",
            "notes": "Annual renewal via bank",
            "recorded_by": {
                "id": 2,
                "name": "Super Admin"
            },
            "created_at": "2026-05-01T00:00:00+05:45",
            "updated_at": "2026-05-01T00:00:00+05:45"
        },
        {
            "id": 9,
            "amount_npr": 2500,
            "amount_formatted": "NPR 2,500",
            "subscription_cycle": "monthly",
            "subscription_cycle_label": "Monthly",
            "method": "esewa",
            "method_label": "eSewa",
            "status": "paid",
            "status_label": "Paid",
            "paid_at": "2026-04-13T00:00:00+05:45",
            "paid_at_formatted": "Apr 13, 2026",
            "covers_from": "2026-04-13T00:00:00+05:45",
            "covers_until": "2026-05-13T00:00:00+05:45",
            "reference": null,
            "notes": null,
            "recorded_by": {
                "id": 2,
                "name": "Super Admin"
            },
            "created_at": "2026-04-13T00:00:00+05:45",
            "updated_at": "2026-04-13T00:00:00+05:45"
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 3,
        "per_page": 15,
        "total": 32,
        "from": 1,
        "to": 15
    }
}
```

**Error Response (404) — No studio associated:**

```json
{
    "message": "No studio is associated with your account."
}
```

**Response Fields:**

| Field                     | Type      | Description                                   |
|---------------------------|-----------|-----------------------------------------------|
| message                   | string    | Success message                               |
| studio.id                 | int       | Studio ID                                     |
| studio.name               | string    | Studio name                                   |
| payments                  | array     | Array of payment objects (see below)          |
| meta.current_page         | int       | Current page number                           |
| meta.last_page            | int       | Last page number                              |
| meta.per_page             | int       | Items per page                                |
| meta.total                | int       | Total number of payments                      |
| meta.from                 | int|null  | First item number on this page                |
| meta.to                   | int|null  | Last item number on this page                 |

**Payment object:**

| Field                    | Type      | Description                                  |
|--------------------------|-----------|----------------------------------------------|
| id                       | int       | Payment ID                                   |
| amount_npr               | int       | Amount in NPR                                |
| amount_formatted         | string    | Formatted: "NPR 5,000"                       |
| subscription_cycle       | string    | `monthly` or `annually`                      |
| subscription_cycle_label | string    | "Monthly" or "Annually"                      |
| method                   | string    | `cash`, `bank_transfer`, `esewa`, `khalti`, `other` |
| method_label             | string    | "Cash", "Bank transfer", "eSewa", etc.       |
| status                   | string    | `paid`, `pending`, `failed`                  |
| status_label             | string    | "Paid", "Pending", "Failed"                  |
| paid_at                  | string    | ISO 8601 date when payment was made          |
| paid_at_formatted        | string    | Human readable: "May 1, 2026"                |
| covers_from              | string|null | ISO 8601 date coverage starts                |
| covers_until             | string|null | ISO 8601 date coverage ends                  |
| reference                | string|null | Payment reference / transaction ID           |
| notes                    | string|null | Additional notes                             |
| recorded_by.id           | int       | Admin who recorded the payment               |
| recorded_by.name         | string    | Admin name                                   |
| created_at               | string    | ISO 8601 timestamp                           |
| updated_at               | string    | ISO 8601 timestamp                           |

---

## Usage

```javascript
// Fetch payment history with filters
const params = new URLSearchParams({
    per_page: 10,
    sort: 'paid_at',
    direction: 'desc',
});

const response = await fetch(`/api/studio/payments?${params}`, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    }
});

const data = await response.json();
const { payments, meta } = data;

// Render payment table
payments.forEach(payment => {
    console.log(`${payment.paid_at_formatted} - ${payment.amount_formatted} (${payment.method_label})`);
});

// Pagination UI
const { current_page, last_page, total } = meta;
console.log(`Page ${current_page} of ${last_page} (${total} total)`);

// Filter by status
const filterResponse = await fetch('/api/studio/payments?status=paid&from=2026-01-01&until=2026-06-30', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    }
});
```

## Payment Method Enums

| Value          | Label           | Description            |
|----------------|-----------------|------------------------|
| cash           | Cash            | Cash payment           |
| bank_transfer  | Bank transfer   | Bank transfer          |
| esewa          | eSewa           | eSewa digital wallet   |
| khalti         | Khalti          | Khalti digital wallet  |
| other          | Other           | Other payment method   |

## Payment Status Enums

| Value   | Label   | Description                        |
|---------|---------|------------------------------------|
| paid    | Paid    | Payment confirmed and settled      |
| pending | Pending | Payment initiated, not yet cleared |
| failed  | Failed  | Payment failed or reversed         |
