# Influencer Hub API Documentation

Complete API reference for the Influencer Hub platform.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types

**Access Token**
- Duration: 15 minutes
- Used for API requests
- Obtained after login/signup

**Refresh Token**
- Duration: 7 days
- Used to obtain new access tokens
- Should be stored securely

## API Endpoints

### Authentication

#### 1. Creator Signup
**Endpoint**: `POST /auth/signup`

**Request Body**:
```json
{
  "role": "creator",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "phone": "+91 9876543210",
  "whatsappNumber": "+91 9876543210",
  "instagramProfile": "https://instagram.com/johndoe",
  "instagramUsername": "johndoe",
  "followersCount": 50000,
  "averageReelViews": 10000,
  "pastCollaborations": 5,
  "age": 25,
  "gender": "male",
  "address": "123 Main Street, Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pincode": "400001",
  "contentNiche": ["Fashion", "Lifestyle"],
  "creatorType": "Micro Influencer",
  "youtubeLink": "https://youtube.com/@johndoe",
  "youtubeSubscribers": 25000
}
```

**Response** (201 Created):
```json
{
  "message": "Creator account created successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1707-x9a8b7c6d5e4",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator",
    "verificationStatus": "pending"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `409 Conflict`: Email/phone/Instagram username already registered

---

#### 2. Brand Signup
**Endpoint**: `POST /auth/signup`

**Request Body**:
```json
{
  "role": "brand",
  "name": "John Smith",
  "email": "brand@company.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "phone": "+91 9876543210",
  "companyName": "Fashion Brand Co.",
  "website": "https://fashionbrand.com",
  "industry": "Fashion",
  "description": "Leading fashion brand targeting Gen Z audience"
}
```

**Response** (201 Created):
```json
{
  "message": "Brand account created successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1707-x9a8b7c6d5e4",
    "name": "Fashion Brand Co.",
    "email": "brand@company.com",
    "role": "brand",
    "verificationStatus": "pending"
  }
}
```

---

#### 3. Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "creator"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1707-x9a8b7c6d5e4",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator",
    "verificationStatus": "pending",
    "subscriptionStatus": "free"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email/password
- `401 Unauthorized`: Invalid credentials

---

## Data Validation Rules

### Password Requirements
- Minimum 8 characters
- At least 1 letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Phone Number Format
- E.164 format: +[country code][number]
- Example: +91 9876543210
- Auto-formatted to +919876543210

### Pincode Format
- India: 5-6 digits
- Example: 400001

### Email Format
- Standard email validation
- Must be unique across system

---

## Response Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or missing fields |
| 401 | Unauthorized - Invalid or missing authentication |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server-side error |

---

## Error Response Format

All errors return consistent format:

```json
{
  "error": "Error message describing the problem",
  "details": ["Additional detail 1", "Additional detail 2"]
}
```

Example:
```json
{
  "error": "Password does not meet requirements",
  "details": [
    "Password must be at least 8 characters long",
    "Password must contain at least one special character (!@#$%^&*)"
  ]
}
```

---

## Rate Limiting

### Current Implementation
- No rate limiting in MVP (to be added)

### Planned
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## Pagination

### Future Implementation
All list endpoints will support pagination:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Future Endpoints

### Campaigns
- `POST /campaigns` - Create campaign (Brand)
- `GET /campaigns` - List campaigns
- `GET /campaigns/:id` - Get campaign details
- `PUT /campaigns/:id` - Update campaign (Brand)
- `DELETE /campaigns/:id` - Delete campaign (Brand)

### Campaign Applications
- `POST /campaigns/:id/apply` - Apply to campaign (Creator)
- `GET /campaigns/:id/applications` - List applications (Brand)
- `PATCH /applications/:id` - Approve/reject application (Brand)

### File Uploads
- `POST /uploads` - Upload file
- `GET /uploads` - List user uploads
- `DELETE /uploads/:id` - Delete upload

### Creators
- `GET /creators` - List creators
- `GET /creators/:id` - Get creator profile
- `PUT /creators/:id` - Update profile (Self only)

### Subscriptions
- `POST /subscriptions` - Create subscription
- `GET /subscriptions/me` - Get user subscription
- `POST /subscriptions/cancel` - Cancel subscription

### Notifications
- `GET /notifications` - List notifications
- `PATCH /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

---

## Webhooks

### Planned Webhook Events

**Stripe Webhooks**
- `payment.succeeded` - Payment successful
- `payment.failed` - Payment failed
- `subscription.created` - Subscription started
- `subscription.deleted` - Subscription cancelled

**Application Webhooks**
- `campaign.created` - New campaign
- `application.submitted` - Creator applied
- `application.approved` - Application approved
- `application.rejected` - Application rejected

---

## Code Examples

### JavaScript/TypeScript

#### Signup (Creator)
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'creator',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    // ... other fields
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

#### Login
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!',
    role: 'creator'
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);
```

#### Protected Request
```typescript
const response = await fetch('/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});
```

---

## Migration Guide

### From In-Memory to MongoDB

```typescript
// Before (in-memory)
const creators = db.creators.get(id);

// After (MongoDB)
const creator = await Creator.findById(id);
```

### From In-Memory to PostgreSQL/Neon

```typescript
// Before
const campaigns = Array.from(db.campaigns.values());

// After
const campaigns = await db.select().from(campaigns_table);
```

---

## Troubleshooting

### Common Errors

**"Email already registered"**
- Cause: Email already exists
- Solution: Use different email or reset password

**"Password does not meet requirements"**
- Cause: Weak password
- Solution: Use stronger password with letters, numbers, special chars

**"Invalid phone number"**
- Cause: Wrong format
- Solution: Use E.164 format like +91 9876543210

**"Unauthorized"**
- Cause: Missing or expired token
- Solution: Login again to get new token

---

## Support

For API issues:
1. Check this documentation
2. Review error response messages
3. Check server logs
4. Contact development team

---

**Last Updated**: 2024
**Version**: 1.0 (MVP)
