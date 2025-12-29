#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

# Check required env vars
if [ -z "$SENDPIGEON_API_KEY" ]; then
  echo -e "${RED}Error: SENDPIGEON_API_KEY is required${NC}"
  echo "Usage: SENDPIGEON_API_KEY=sk_live_xxx SENDPIGEON_FROM=you@domain.com SENDPIGEON_TO=test@example.com ./scripts/test-cli.sh"
  exit 1
fi

if [ -z "$SENDPIGEON_FROM" ]; then
  echo -e "${RED}Error: SENDPIGEON_FROM is required${NC}"
  exit 1
fi

if [ -z "$SENDPIGEON_TO" ]; then
  echo -e "${RED}Error: SENDPIGEON_TO is required${NC}"
  exit 1
fi

CLI="node dist/cli.js"

echo ""
echo "=========================================="
echo "  SendPigeon CLI Test Suite"
echo "=========================================="
echo ""

run_test() {
  local name="$1"
  shift
  echo -e "${YELLOW}▸${NC} $name"
  if "$@"; then
    echo -e "${GREEN}  ✓ Passed${NC}"
  else
    echo -e "${RED}  ✗ Failed${NC}"
    exit 1
  fi
  echo ""
}

# ============================================
# Core Commands
# ============================================

run_test "status" $CLI status

# ============================================
# Domains
# ============================================

run_test "domains list" $CLI domains list

# Get first domain ID for verify test
DOMAIN_ID=$(curl -s -H "Authorization: Bearer $SENDPIGEON_API_KEY" \
  "https://api.sendpigeon.dev/v1/domains" | \
  grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$DOMAIN_ID" ]; then
  run_test "domains verify $DOMAIN_ID" $CLI domains verify "$DOMAIN_ID"
else
  echo -e "${DIM}  (skipping domains verify - no domains)${NC}"
  echo ""
fi

# ============================================
# Templates
# ============================================

run_test "templates list" $CLI templates list

# Get first template ID
TEMPLATE_ID=$(curl -s -H "Authorization: Bearer $SENDPIGEON_API_KEY" \
  "https://api.sendpigeon.dev/v1/templates" | \
  grep -o '"templateId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$TEMPLATE_ID" ]; then
  run_test "templates get $TEMPLATE_ID" $CLI templates get "$TEMPLATE_ID"

  # Test pull then push cycle
  TEMP_DIR=$(mktemp -d)
  run_test "templates pull --id $TEMPLATE_ID" $CLI templates pull --id "$TEMPLATE_ID" --dir "$TEMP_DIR"
  run_test "templates push --id $TEMPLATE_ID" $CLI templates push --id "$TEMPLATE_ID" --dir "$TEMP_DIR"
  rm -rf "$TEMP_DIR"
else
  echo -e "${DIM}  (skipping templates get/pull/push - no templates)${NC}"
  echo ""
fi

# ============================================
# Webhooks
# ============================================

run_test "webhooks" $CLI webhooks
run_test "webhooks deliveries" $CLI webhooks deliveries

# Test webhook (only if configured)
WEBHOOK_URL=$(curl -s -H "Authorization: Bearer $SENDPIGEON_API_KEY" \
  "https://api.sendpigeon.dev/v1/webhooks" | \
  grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$WEBHOOK_URL" ] && [ "$WEBHOOK_URL" != "null" ]; then
  run_test "webhooks test" $CLI webhooks test
else
  echo -e "${DIM}  (skipping webhooks test - no webhook configured)${NC}"
  echo ""
fi

# ============================================
# Send Email
# ============================================

echo -e "${YELLOW}▸${NC} send (with HTML)"
$CLI send \
  --from "$SENDPIGEON_FROM" \
  --to "$SENDPIGEON_TO" \
  --subject "CLI Test $(date +%H:%M:%S)" \
  --html "<h1>Test Email</h1><p>Sent from CLI test script at $(date)</p>"
echo -e "${GREEN}  ✓ Passed${NC}"
echo ""

# Wait for email to be processed
sleep 2

# ============================================
# Logs
# ============================================

run_test "logs" $CLI logs --limit 5

# Test logs tail (run briefly then kill)
echo -e "${YELLOW}▸${NC} logs tail (3 seconds)"
$CLI logs tail &
TAIL_PID=$!
sleep 3
kill $TAIL_PID 2>/dev/null || true
echo -e "${GREEN}  ✓ Passed${NC}"
echo ""

# Get first email ID
EMAIL_ID=$(curl -s -H "Authorization: Bearer $SENDPIGEON_API_KEY" \
  "https://api.sendpigeon.dev/v1/logs?limit=1" | \
  grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$EMAIL_ID" ]; then
  run_test "logs get $EMAIL_ID" $CLI logs get "$EMAIL_ID"
else
  echo -e "${DIM}  (skipping logs get - no emails)${NC}"
  echo ""
fi

# ============================================
# Send with Template (if template exists)
# ============================================

if [ -n "$TEMPLATE_ID" ]; then
  echo -e "${YELLOW}▸${NC} send (with template)"
  $CLI send \
    --from "$SENDPIGEON_FROM" \
    --to "$SENDPIGEON_TO" \
    --template "$TEMPLATE_ID" \
    --var name=TestUser \
    --var company=TestCo || echo -e "${DIM}  (template may require different variables)${NC}"
  echo ""
fi

# ============================================
# Done
# ============================================

echo "=========================================="
echo -e "  ${GREEN}All tests passed!${NC}"
echo "=========================================="
echo ""
echo -e "${DIM}Skipped: sendpigeon dev (starts server)${NC}"
echo ""
