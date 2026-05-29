#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"

mkdir -p "$RUN_DIR"

"$ROOT_DIR/scripts/db-check.sh" local

SKIP_DB_CHECK=1 "$ROOT_DIR/scripts/dev-backend.sh" &
BACKEND_PID="$!"
echo "$BACKEND_PID" > "$RUN_DIR/backend.pid"

"$ROOT_DIR/scripts/dev-frontend.sh" &
FRONTEND_PID="$!"
echo "$FRONTEND_PID" > "$RUN_DIR/frontend.pid"
echo "$$" > "$RUN_DIR/dev.pid"

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  rm -f "$RUN_DIR/backend.pid" "$RUN_DIR/frontend.pid" "$RUN_DIR/dev.pid"
}

trap cleanup INT TERM EXIT
set +e
wait
STATUS="$?"
set -e
exit "$STATUS"
