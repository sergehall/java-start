#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.local}"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
OPEN_BROWSER_TIMEOUT_SECONDS="${OPEN_BROWSER_TIMEOUT_SECONDS:-60}"

open_url() {
  url="$1"

  if command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
    return
  fi

  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
    return
  fi

  echo "Frontend is ready: $url"
}

if ! command -v curl >/dev/null 2>&1; then
  sleep 3
  open_url "$FRONTEND_URL"
  exit 0
fi

elapsed_seconds=0
while [ "$elapsed_seconds" -lt "$OPEN_BROWSER_TIMEOUT_SECONDS" ]; do
  if curl -fsS "$FRONTEND_URL" >/dev/null 2>&1; then
    open_url "$FRONTEND_URL"
    exit 0
  fi

  sleep 1
  elapsed_seconds=$((elapsed_seconds + 1))
done

echo "Frontend did not become ready before the browser timeout: $FRONTEND_URL" >&2
