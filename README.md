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

const { data, error } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Hello!",
  html: "<p>Welcome aboard.</p>",
});

if (error) {
  console.log(error.message); // "Domain not verified"
  console.log(error.code);    // "api_error" | "network_error"
  console.log(error.status);  // 403 (only for api_error)
  return;
}

console.log(data.id); // "email_abc123"
```

### With template

```typescript
const { data, error } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  templateId: "welcome-template",
  variables: { name: "Johan" },
});
```

### With attachments

```typescript
import fs from "fs";

// Base64 content
const { data, error } = await pigeon.send({
  from: "invoices@yourdomain.com",
  to: "customer@example.com",
  subject: "Your invoice",
  html: "<p>See attached.</p>",
  attachments: [
    {
      filename: "invoice.pdf",
      content: fs.readFileSync("invoice.pdf").toString("base64"),
    },
  ],
});

// URL (fetched server-side)
const { data, error } = await pigeon.send({
  from: "reports@yourdomain.com",
  to: "customer@example.com",
  subject: "Your report",
  html: "<p>See attached.</p>",
  attachments: [
    {
      filename: "report.pdf",
      path: "https://example.com/reports/123.pdf",
    },
  ],
});
```

Limits: 7MB per file, 25MB total. HTTPS only for URLs. Executables (.exe, .bat, etc.) are blocked.

## Templates

Manage email templates programmatically:

```typescript
// List all templates
const { data: templates } = await pigeon.templates.list();

// Create a template
const { data: template } = await pigeon.templates.create({
  name: "welcome-email",
  subject: "Welcome {{name}}!",
  html: "<p>Hello {{name}}, welcome to {{company}}!</p>",
  text: "Hello {{name}}, welcome to {{company}}!",
});

// Get a template by ID
const { data: template } = await pigeon.templates.get("tpl_abc123");

// Update a template
await pigeon.templates.update("tpl_abc123", {
  subject: "Updated subject",
});

// Delete a template
await pigeon.templates.delete("tpl_abc123");
```

Template names must be lowercase alphanumeric with dashes (e.g., `welcome-email`). Variables use `{{variableName}}` syntax and are auto-detected from subject/html/text.

## Configuration

```typescript
const pigeon = new SendPigeon("your-api-key", {
  baseUrl: "https://api.sendpigeon.dev", // optional
});
```

## License

MIT
