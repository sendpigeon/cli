# sendpigeon

Official Node.js SDK for [SendPigeon](https://sendpigeon.dev) email API.

## Install

```bash
npm install sendpigeon
```

## Usage

```typescript
import { createSendPigeon } from "sendpigeon";

const pigeon = createSendPigeon("your-api-key");

// Send email
const { id, status } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Hello!",
  html: "<p>Welcome aboard.</p>",
});

// With template
await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  templateId: "welcome-template",
  variables: { name: "Johan" },
});
```

## Error handling

```typescript
import { createSendPigeon, SendPigeonError } from "sendpigeon";

try {
  await pigeon.send({ ... });
} catch (err) {
  if (err instanceof SendPigeonError) {
    console.log(err.message); // "Domain not verified"
    console.log(err.status);  // 403
  }
}
```

## Configuration

```typescript
const pigeon = createSendPigeon({
  apiKey: "your-api-key",
  baseUrl: "https://api.sendpigeon.dev", // optional
});
```

## License

MIT
