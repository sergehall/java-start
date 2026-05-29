#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.local}"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1091
  . "$ROOT_DIR/scripts/lib/env.sh"
  load_env_file "$ENV_FILE"
fi

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

stop_pid_tree() {
  pid="$1"

  if [ -z "$pid" ] || ! kill -0 "$pid" 2>/dev/null; then
    return
  fi

  if command -v pgrep >/dev/null 2>&1; then
    for child_pid in $(pgrep -P "$pid" 2>/dev/null || true); do
      stop_pid_tree "$child_pid"
    done
  fi

  kill "$pid" 2>/dev/null || true
  sleep 1
  if kill -0 "$pid" 2>/dev/null; then
    kill -KILL "$pid" 2>/dev/null || true
  fi
}

stop_from_file() {
  pid_file="$1"

  if [ ! -f "$pid_file" ]; then
    return
  fi

  pid="$(cat "$pid_file")"
  stop_pid_tree "$pid"
  rm -f "$pid_file"
}

stop_project_port() {
  port="$1"

  if ! command -v lsof >/dev/null 2>&1; then
    return
  fi

  for pid in $(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true); do
    cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' || true)"
    case "$cwd" in
      "$ROOT_DIR"|"$ROOT_DIR"/*) stop_pid_tree "$pid" ;;
    esac
  done
}

stop_from_file "$RUN_DIR/dev.pid"
sleep 1
stop_from_file "$RUN_DIR/backend.pid"
stop_from_file "$RUN_DIR/frontend.pid"

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_PORT="$(port_from_url "$BACKEND_URL" "${SERVER_PORT:-8080}")"
FRONTEND_PORT="$(port_from_url "$FRONTEND_URL" 3000)"

stop_project_port "$BACKEND_PORT"
stop_project_port "$FRONTEND_PORT"

echo "Development processes are stopped."
