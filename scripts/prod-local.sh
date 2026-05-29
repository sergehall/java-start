#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
FRONTEND_ENV_FILE="$ROOT_DIR/frontend/.env"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

"$ROOT_DIR/scripts/db-check.sh" prod

env -i \
  HOME="${HOME:-}" \
  PATH="${PATH:-}" \
  SHELL="${SHELL:-/bin/sh}" \
  USER="${USER:-}" \
  LOGNAME="${LOGNAME:-}" \
  TMPDIR="${TMPDIR:-/tmp}" \
  TERM="${TERM:-xterm-256color}" \
  FRONTEND_ENV_FILE="$FRONTEND_ENV_FILE" \
  "$ROOT_DIR/scripts/run-frontend-command.sh" build

cd "$ROOT_DIR/backend"
load_env_file "$ENV_FILE"
./mvnw -DskipTests package
java -jar target/java-start-backend-0.1.0-SNAPSHOT.jar &
BACKEND_PID="$!"

env -i \
  HOME="${HOME:-}" \
  PATH="${PATH:-}" \
  SHELL="${SHELL:-/bin/sh}" \
  USER="${USER:-}" \
  LOGNAME="${LOGNAME:-}" \
  TMPDIR="${TMPDIR:-/tmp}" \
  TERM="${TERM:-xterm-256color}" \
  FRONTEND_ENV_FILE="$FRONTEND_ENV_FILE" \
  "$ROOT_DIR/scripts/run-frontend-command.sh" start &
FRONTEND_PID="$!"

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT
wait
