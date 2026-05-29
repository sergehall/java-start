#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
ENV_FILE="$ROOT_DIR/.env.local"
BACKEND_READY_TIMEOUT_SECONDS="${BACKEND_READY_TIMEOUT_SECONDS:-90}"

mkdir -p "$RUN_DIR"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

"$ROOT_DIR/scripts/db-check.sh" local

port_from_url() {
  url="$1"
  fallback_port="$2"
  port="$(printf '%s\n' "$url" | sed -n 's#^[a-zA-Z][a-zA-Z0-9+.-]*://[^:/]*:\([0-9][0-9]*\).*#\1#p')"
  if [ -n "$port" ]; then
    printf '%s\n' "$port"
  else
    printf '%s\n' "$fallback_port"
  fi
}

fail_if_port_in_use() {
  port="$1"
  service_name="$2"

  if command -v lsof >/dev/null 2>&1; then
    owner="$(lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    if [ -n "$owner" ]; then
      echo "$service_name port $port is already in use." >&2
      echo "$owner" >&2
      echo "Run: pnpm dev:stop" >&2
      exit 1
    fi
    return
  fi

  if command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 "$port" >/dev/null 2>&1; then
    echo "$service_name port $port is already in use." >&2
    echo "Run: pnpm dev:stop" >&2
    exit 1
  fi
}

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_PORT="$(port_from_url "$BACKEND_URL" "${SERVER_PORT:-8080}")"
FRONTEND_PORT="$(port_from_url "$FRONTEND_URL" 3000)"

fail_if_port_in_use "$BACKEND_PORT" "Backend"
fail_if_port_in_use "$FRONTEND_PORT" "Frontend"

SKIP_DB_CHECK=1 "$ROOT_DIR/scripts/dev-backend.sh" &
BACKEND_PID="$!"
echo "$BACKEND_PID" > "$RUN_DIR/backend.pid"

cleanup() {
  kill "$BACKEND_PID" "${FRONTEND_PID:-}" 2>/dev/null || true
  rm -f "$RUN_DIR/backend.pid" "$RUN_DIR/frontend.pid" "$RUN_DIR/dev.pid"
}

trap cleanup INT TERM EXIT

BACKEND_HEALTH_URL="$BACKEND_URL/actuator/health"

if command -v curl >/dev/null 2>&1; then
  elapsed_seconds=0
  until curl -fsS "$BACKEND_HEALTH_URL" >/dev/null 2>&1; do
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
      echo "Backend stopped before it became ready." >&2
      exit 1
    fi

    if [ "$elapsed_seconds" -ge "$BACKEND_READY_TIMEOUT_SECONDS" ]; then
      echo "Backend did not become ready before timeout: $BACKEND_HEALTH_URL" >&2
      exit 1
    fi

    sleep 1
    elapsed_seconds=$((elapsed_seconds + 1))
  done
else
  sleep 8
fi

"$ROOT_DIR/scripts/dev-frontend.sh" &
FRONTEND_PID="$!"
echo "$FRONTEND_PID" > "$RUN_DIR/frontend.pid"
echo "$$" > "$RUN_DIR/dev.pid"
set +e
wait
STATUS="$?"
set -e
exit "$STATUS"
