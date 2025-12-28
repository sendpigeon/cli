# @sendpigeon-sdk/cli

SendPigeon CLI for local email development.

## Installation

```bash
# Global install
npm install -g @sendpigeon-sdk/cli

# Or use with npx
npx @sendpigeon-sdk/cli dev
```

## Usage

### Dev Server

Start a local email catching server:

```bash
sendpigeon dev
```

This starts:
- **API** at `http://localhost:4100/v1/emails` - catches emails sent via SDK
- **UI** at `http://localhost:4100` - view caught emails

### Options

```bash
sendpigeon dev --port 3000    # Custom port
PORT=3000 sendpigeon dev      # Via environment variable
```

## SDK Integration

Set `SENDPIGEON_DEV=true` to automatically route emails to the local dev server:

```bash
SENDPIGEON_DEV=true node your-app.js
```

Or configure the SDK directly:

```typescript
import { SendPigeon } from 'sendpigeon';

const client = new SendPigeon('sk_test_...', {
  baseUrl: 'http://localhost:4100'
});
```

## License

MIT
