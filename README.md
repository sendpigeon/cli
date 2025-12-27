# sendpigeon

Official Node.js SDK for [SendPigeon](https://sendpigeon.dev) - transactional email API.

## Install

```bash
npm install sendpigeon
```

## Quick Start

```typescript
import { SendPigeon } from "sendpigeon";

const pigeon = new SendPigeon("sp_live_your_api_key");

const { data, error } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Hello!",
  html: "<p>Welcome aboard.</p>",
});

if (error) {
  console.error(error.message);
  // error.code: "api_error" | "network_error" | "timeout_error"
  // error.apiCode: "QUOTA_EXCEEDED" | "DOMAIN_NOT_VERIFIED" | ...
  // error.status: 402
} else {
  console.log(data.id); // "em_abc123"
}
```

## Configuration

```typescript
const pigeon = new SendPigeon("sp_live_your_api_key", {
  timeout: 30000,   // request timeout in ms (default: 30s)
  maxRetries: 2,    // retry on 429/5xx (default: 2, max: 5, 0 to disable)
  debug: true,      // log requests/responses to console
});
```

Retries use exponential backoff and respect `Retry-After` headers.

## Local Development

Use [sendpigeon-dev](https://www.npmjs.com/package/sendpigeon-dev) to catch emails locally:

```bash
# Terminal 1: Start local server
npx sendpigeon-dev

# Terminal 2: Run your app with dev mode
SENDPIGEON_DEV=true npm run dev
```

When `SENDPIGEON_DEV=true`, the SDK routes requests to `localhost:4100` instead of production.

## Available Methods

```typescript
// Send emails
pigeon.send(email)
pigeon.sendBatch(emails)

// Email status
pigeon.emails.get(id)
pigeon.emails.cancel(id)

// Templates
pigeon.templates.list()
pigeon.templates.create(data)
pigeon.templates.get(id)
pigeon.templates.update(id, data)
pigeon.templates.delete(id)

// Domains
pigeon.domains.list()
pigeon.domains.create({ name })
pigeon.domains.get(id)
pigeon.domains.verify(id)
pigeon.domains.delete(id)

// API Keys
pigeon.apiKeys.list()
pigeon.apiKeys.create({ name, mode?, permission? })
pigeon.apiKeys.delete(id)
```

## Webhook Verification

```typescript
import { verifyWebhook, verifyInboundWebhook } from "sendpigeon";

// Outbound events (delivered, bounced, complained)
const result = await verifyWebhook({ payload, signature, timestamp, secret });

// Inbound emails
const result = await verifyInboundWebhook({ payload, signature, timestamp, secret });
```

## Documentation

Full documentation with examples: **[sendpigeon.dev/docs](https://sendpigeon.dev/docs)**

## License

MIT
