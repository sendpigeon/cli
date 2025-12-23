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
  console.log(error.message); // "Quota exceeded"
  console.log(error.code);    // "api_error" | "network_error" | "timeout_error"
  console.log(error.apiCode); // "QUOTA_EXCEEDED" (API-specific code)
  console.log(error.status);  // 402
  return;
}

console.log(data.id); // "email_abc123"
```

### With tags and metadata

Track and filter emails with tags and metadata:

```typescript
const { data } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Order confirmed",
  html: "<p>Your order is confirmed.</p>",
  tags: ["order", "confirmation"],
  metadata: { orderId: "12345", userId: "abc" },
});
```

Tags and metadata are returned in webhooks and when fetching email details.

### With custom headers

```typescript
const { data } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Important update",
  html: "<p>Please read.</p>",
  headers: {
    "X-Priority": "1",
    "List-Unsubscribe": "<mailto:unsub@yourdomain.com>",
  },
});
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

## Get email status

Check delivery status of a sent email:

```typescript
const { data, error } = await pigeon.emails.get("email_abc123");

if (data) {
  console.log(data.status);   // "delivered" | "bounced" | "complained" | ...
  console.log(data.tags);     // ["order", "confirmation"]
  console.log(data.metadata); // { orderId: "12345" }
}
```

## Batch sending

Send up to 100 emails in a single request. Each email is processed independently - some may succeed while others fail.

```typescript
const { data, error } = await pigeon.sendBatch([
  {
    from: "hello@yourdomain.com",
    to: "user1@example.com",
    subject: "Hello User 1",
    html: "<p>Welcome!</p>",
    tags: ["welcome"],
  },
  {
    from: "hello@yourdomain.com",
    to: "user2@example.com",
    subject: "Hello User 2",
    html: "<p>Welcome!</p>",
    tags: ["welcome"],
  },
]);

if (error) {
  // Network or auth error - no emails sent
  console.log(error.message);
  return;
}

// Check results per email
console.log(data.summary); // { total: 2, sent: 2, failed: 0 }

for (const result of data.data) {
  if (result.status === "sent") {
    console.log(`Email ${result.index} sent: ${result.id}`);
  } else {
    console.log(`Email ${result.index} failed: ${result.error.code}`);
  }
}
```

## Scheduling

Schedule emails to send later (up to 30 days ahead):

```typescript
const { data, error } = await pigeon.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Happy New Year!",
  html: "<p>Best wishes for 2025!</p>",
  scheduled_at: "2025-01-01T00:00:00Z",
});

console.log(data.id); // Use this ID to cancel if needed
```

### Cancel scheduled email

```typescript
const { error } = await pigeon.emails.cancel("email_abc123");
```

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

## Webhook verification

Verify webhook signatures in your endpoint:

```typescript
import { verifyWebhook } from "sendpigeon";

app.post("/webhook", async (req, res) => {
  const result = await verifyWebhook({
    payload: req.body, // raw body string
    signature: req.headers["x-webhook-signature"],
    timestamp: req.headers["x-webhook-timestamp"],
    secret: process.env.WEBHOOK_SECRET,
  });

  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  const { event, data } = result.payload;

  switch (event) {
    case "email.delivered":
      console.log(`Email ${data.emailId} delivered to ${data.toAddress}`);
      break;
    case "email.bounced":
      console.log(`Email ${data.emailId} bounced: ${data.bounceType}`);
      break;
    case "email.complained":
      console.log(`Email ${data.emailId} marked as spam`);
      break;
  }

  res.sendStatus(200);
});
```

## Configuration

```typescript
const pigeon = new SendPigeon("your-api-key", {
  baseUrl: "https://api.sendpigeon.dev", // optional
  timeout: 30000, // request timeout in ms (default: 30s)
});
```

## Error codes

The SDK returns specific error codes from the API:

| apiCode | Meaning |
|---------|---------|
| `QUOTA_EXCEEDED` | Monthly email limit reached |
| `DOMAIN_NOT_VERIFIED` | Domain needs DNS verification |
| `SENDING_DISABLED` | Account disabled due to high bounce/complaint rate |
| `TEMPLATE_NOT_FOUND` | Template ID doesn't exist |
| `MISSING_VARIABLES` | Template variables not provided |
| `NOT_FOUND` | Resource not found |

```typescript
if (error?.apiCode === "QUOTA_EXCEEDED") {
  // Prompt user to upgrade plan
}
```

## License

MIT
