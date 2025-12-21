# sendpigeon-node

Official Node.js SDK for [SendPigeon](https://sendpigeon.dev) email API.

## Install

```bash
npm install sendpigeon
```

## Usage

```typescript
import { SendPigeon } from "sendpigeon";

const pigeon = new SendPigeon("your-api-key");

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

## Templates

Manage email templates programmatically:

```typescript
// List all templates
const templates = await pigeon.templates.list();

// Create a template
const template = await pigeon.templates.create({
  name: "welcome-email",
  subject: "Welcome {{name}}!",
  html: "<p>Hello {{name}}, welcome to {{company}}!</p>",
  text: "Hello {{name}}, welcome to {{company}}!",
});

// Get a template by ID
const template = await pigeon.templates.get("tpl_abc123");

// Update a template
await pigeon.templates.update("tpl_abc123", {
  subject: "Updated subject",
});

// Delete a template
await pigeon.templates.delete("tpl_abc123");
```

Template names must be lowercase alphanumeric with dashes (e.g., `welcome-email`). Variables use `{{variableName}}` syntax and are auto-detected from subject/html/text.

## Error handling

```typescript
import { SendPigeon, SendPigeonError } from "sendpigeon";

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
const pigeon = new SendPigeon("your-api-key", {
  baseUrl: "https://api.sendpigeon.dev", // optional
});
```

## License

MIT
