# API Conventions (Draft)

> مصطلحات هذا المستند:
> - واجهة برمجة التطبيقات: Application Programming Interface — API
> - رمز ويب بصيغة JSON: JSON Web Token — JWT
> - التحكم بالوصول المعتمد على الأدوار: Role-Based Access Control — RBAC
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

Status: Draft — aligns v2.0

## Versioning & Base
- Base path: `/api/v2` (example)
- Semantic changes require minor/major bump per `VERSION-LOCK-V2.0.md`

## Naming
- Kebab-case for paths: `/auth/sign-in`, `/projects/{id}`
- snake_case for JSON fields
- Plurals for collections `/projects` and singular resources `/projects/{id}`

## Required Headers
```
Authorization: Bearer {firebase_id_token}
Content-Type: application/json
X-Platform: android|ios|web
X-App-Version: {semver}
X-Device-ID: {uuid}
```

## Errors (Unified)
```json
{
  "success": false,
  "error": {
    "code": "AUTH/INVALID_TOKEN",
    "message": "Session expired",
    "details": {"retryAfter": 30}
  }
}
```
- Map error codes in `03-api/core/04-error-handling.md`

## Pagination
- Query: `?page=1&limit=20`
- Response meta: `{ "page": 1, "limit": 20, "total": 134 }`

## Rate Limiting
- Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
- See `02-rate-limiting.md`

## Idempotency (if needed)
- Header: `Idempotency-Key: {uuid}` for POSTs that can be retried

## Security
- Enforce role/permission checks per `99-reference/05-roles-matrix.md`
- Log `X-Device-ID` and platform into Sessions table
