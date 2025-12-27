# SendPigeon Node.js SDK - Setup Plan

## Overview

Standalone SDK for SendPigeon email API. Published as `sendpigeon` on npm.

---

## Before Starting

### Create Accounts

1. **GitHub org**: github.com/organizations/new → create `sendpigeon`
2. **npm account**: npmjs.com signup → `npm login`
3. **Check name**: `npm view sendpigeon` (should be 404)

---

## Code Changes

### 1. Remove Template CRUD

From `src/index.ts`, remove:

- `pigeon.templates.list()`
- `pigeon.templates.get(id)`
- `pigeon.templates.create()`
- `pigeon.templates.update()`
- `pigeon.templates.delete()`
- Types: `CreateTemplateRequest`, `UpdateTemplateRequest`

Keep:

- `pigeon.send()` with `templateId` + `variables`
- `SendPigeonError`

### 2. Standalone tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2022"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Update package.json

```json
{
  "name": "sendpigeon",
  "version": "0.1.0",
  "description": "Official Node.js SDK for SendPigeon email API",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "test:run": "vitest run",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/sendpigeon/sendpigeon-node.git"
  },
  "homepage": "https://sendpigeon.dev/docs",
  "bugs": "https://github.com/sendpigeon/sendpigeon-node/issues",
  "keywords": ["email", "transactional", "api", "sendpigeon"],
  "author": "SendPigeon",
  "license": "MIT",
  "engines": { "node": ">=18" },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

---

## Add Tests

### Install

```bash
npm install -D vitest
```

### Test file: src/index.test.ts

Test cases:

- `createSendPigeon()` returns client with `send` method
- `createSendPigeon("api-key")` accepts string
- `createSendPigeon({ apiKey, baseUrl })` accepts config object
- `send()` makes POST to `/v1/emails`
- `send()` includes Authorization header
- `send()` with idempotencyKey sets header
- `SendPigeonError` has status property
- Error handling for non-2xx responses

Mock fetch with `vi.stubGlobal('fetch')`.

---

## Add Files

### .gitignore

```
node_modules/
dist/
.env
*.log
```

### .npmignore

```
src/
*.test.ts
tsconfig.json
vitest.config.ts
.github/
```

### LICENSE (MIT)

Create standard MIT license file.

### CHANGELOG.md

```markdown
# Changelog

## 0.1.0

- Initial release
- Email sending with templates support
```

---

## GitHub Setup

```bash
# Create repo
gh repo create sendpigeon/sendpigeon-node --public --description "SendPigeon Node.js SDK"

# Init and push
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:sendpigeon/sendpigeon-node.git
git push -u origin main
```

---

## npm Publish

```bash
# First publish
npm publish --access public

# Future releases
npm version patch|minor|major
npm publish
```

---

## GitHub Actions

### .github/workflows/test.yml

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - run: npm test
```

### .github/workflows/publish.yml

```yaml
name: Publish
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: npm install
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add `NPM_TOKEN` secret in repo settings.

---

## Checklist

- [ ] Create GitHub org `sendpigeon`
- [ ] Create npm account
- [ ] Check `sendpigeon` name available
- [ ] Remove template CRUD from code
- [ ] Update tsconfig.json
- [ ] Update package.json
- [ ] Add tests
- [ ] Update README
- [ ] Add .gitignore, .npmignore, LICENSE
- [ ] Create GitHub repo
- [ ] Push code
- [ ] Publish to npm
- [ ] Add GitHub Actions
- [ ] Add NPM_TOKEN secret
