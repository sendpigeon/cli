# @sendpigeon-sdk/cli

SendPigeon CLI - send emails and manage your account from the terminal.

## Installation

```bash
npm install -g @sendpigeon-sdk/cli

# Or use with npx
npx @sendpigeon-sdk/cli <command>
```

## Commands

### sendpigeon dev

Start a local dev server for catching emails:

```bash
sendpigeon dev
```

This starts:
- **API** at `http://localhost:4100/v1/emails`
- **UI** at `http://localhost:4100`
- **SMTP** at `localhost:4125`

Options:
- `-p, --port <port>` - HTTP port (default: 4100)
- `--smtp-port <port>` - SMTP port (default: 4125)
- `--no-smtp` - Disable SMTP server

### sendpigeon send

Send an email:

```bash
sendpigeon send \
  --from hello@yourdomain.com \
  --to user@example.com \
  --subject "Hello" \
  --html "<p>Hi there!</p>"

# With template
sendpigeon send \
  --from hello@yourdomain.com \
  --to user@example.com \
  --template welcome \
  --var name=John \
  --var company=Acme
```

Options:
- `--from <email>` - Sender address (required, must be verified domain)
- `--to <email>` - Recipient (required, comma-separated for multiple)
- `--subject <text>` - Email subject
- `--html <html>` - HTML body
- `--text <text>` - Plain text body
- `--template <id>` - Template ID
- `--var <key=value>` - Template variable (repeatable)
- `--cc, --bcc, --reply-to` - Additional recipients
- `--tag <tag>` - Add tag (repeatable, max 5)

### sendpigeon status

Check API key and account status:

```bash
sendpigeon status
```

### sendpigeon templates

Manage email templates:

```bash
sendpigeon templates list              # List all templates
sendpigeon templates get <id>          # Get template details
sendpigeon templates pull              # Download to ./sendpigeon-templates/
sendpigeon templates push              # Upload from ./sendpigeon-templates/
```

### sendpigeon logs

View email logs:

```bash
sendpigeon logs                        # Show recent emails
sendpigeon logs --status bounced       # Filter by status
sendpigeon logs tail                   # Stream in real-time
sendpigeon logs get <id>               # Get email details
```

### sendpigeon webhooks

Manage webhooks:

```bash
sendpigeon webhooks                    # Show webhook config
sendpigeon webhooks test               # Send test webhook
sendpigeon webhooks deliveries         # List recent deliveries
```

### sendpigeon domains

Manage sending domains:

```bash
sendpigeon domains list                # List all domains
sendpigeon domains verify <id>         # Check DNS records
```

## Authentication

Set your API key via environment variable:

```bash
export SENDPIGEON_API_KEY=sk_live_xxx
```

Or pass it to any command:

```bash
sendpigeon status --api-key sk_live_xxx
```

## Local Development

Set `SENDPIGEON_DEV=true` to route SDK requests to the local dev server:

```bash
# Terminal 1
sendpigeon dev

# Terminal 2
SENDPIGEON_DEV=true node your-app.js
```

## License

MIT
