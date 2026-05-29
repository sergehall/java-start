#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

cd "$ROOT_DIR/frontend"
pnpm dev &
FRONTEND_PID="$!"

if [ "${OPEN_BROWSER:-1}" != "0" ]; then
  "$ROOT_DIR/scripts/open-frontend.sh" &
  OPENER_PID="$!"
else
  OPENER_PID=""
fi

cleanup() {
  kill "$FRONTEND_PID" 2>/dev/null || true
  if [ -n "$OPENER_PID" ]; then
    kill "$OPENER_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT
wait "$FRONTEND_PID"
