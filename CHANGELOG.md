# Changelog

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
