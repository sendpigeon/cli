# Changelog

## 1.7.0

- Add Suppressions API (`suppressions.list`, `suppressions.delete`)

## 1.6.0

- Add `email.opened` and `email.clicked` webhook events
- Add `openedAt`, `clickedAt`, `linkUrl`, `linkIndex` to `WebhookPayloadData`

## 1.5.0

**BREAKING**: `verifyWebhook` and `verifyInboundWebhook` now return sync instead of Promise

- Split webhooks into separate file (`src/webhooks.ts`)
- DRY'd webhook verification logic
- Removed redundant comments

## 1.4.0

- Request timeout option (default 30s)
- `apiCode` in error responses (e.g. QUOTA_EXCEEDED, DOMAIN_NOT_VERIFIED)
- Export `EmailDetail`, `AttachmentMeta`, `EmailStatus` types

## 1.3.0

- Scheduling: `scheduled_at` param + `emails.cancel()`
- Batch sending: `emails.sendBatch()`

## 1.2.0

- Domains API: list, create, get, verify, delete
- API Keys API: list, create, delete
- Types generated from OpenAPI schema

## 1.1.0

- Attachments support: `content` (base64) or `path` (URL)
- Limits: 7MB per file, 25MB total
- Blocked extensions: .exe, .bat, .sh, .dll, etc.

## 1.0.0

**BREAKING**: Result pattern for error handling

- All methods return `{ data, error }` instead of throwing
- No try/catch needed, TypeScript narrows types on error check
- Error has `code: "api_error" | "network_error"` and optional `status`

## 0.3.0

- Switch to class-based API: `new SendPigeon(apiKey, options)`
- `createSendPigeon()` deprecated

## 0.2.0

- Templates API (`templates.list`, `create`, `get`, `update`, `delete`)

## 0.1.0

- Initial release
- Email sending with templates support
