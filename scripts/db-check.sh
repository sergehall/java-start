#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-local}"

case "$MODE" in
  local) ENV_FILE="$ROOT_DIR/.env.local" ;;
  prod) ENV_FILE="$ROOT_DIR/.env" ;;
  *)
    echo "Usage: scripts/db-check.sh [local|prod]" >&2
    exit 1
    ;;
esac

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

COMPOSE_FILE="$ROOT_DIR/docker-compose.local.yml"
POSTGRES_SERVICE="postgres"
POSTGRES_HOST="${POSTGRES_HOST:-127.0.0.1}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

fail_with_hint() {
  echo "$1" >&2
  echo "Run: ./scripts/infra-up.sh $MODE" >&2
  exit 1
}

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker CLI is not installed or not available in PATH." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  fail_with_hint "Docker is not running or not reachable. Start Docker Desktop first."
fi

CONTAINER_ID="$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps -a -q "$POSTGRES_SERVICE" 2>/dev/null || true)"

if [ -z "$CONTAINER_ID" ]; then
  fail_with_hint "PostgreSQL is not created for this project yet."
fi

RUNNING="$(docker inspect -f '{{.State.Running}}' "$CONTAINER_ID" 2>/dev/null || true)"
if [ "$RUNNING" != "true" ]; then
  fail_with_hint "PostgreSQL container exists but is not running."
fi

HEALTH="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$CONTAINER_ID" 2>/dev/null || true)"
case "$HEALTH" in
  healthy|none) ;;
  starting) fail_with_hint "PostgreSQL is still starting. Try again in a few seconds." ;;
  *) fail_with_hint "PostgreSQL is not healthy. Current health status: $HEALTH" ;;
esac

if command -v nc >/dev/null 2>&1; then
  if ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT" >/dev/null 2>&1; then
    fail_with_hint "PostgreSQL is running in Docker, but $POSTGRES_HOST:$POSTGRES_PORT is not reachable."
  fi
fi

echo "PostgreSQL is ready on $POSTGRES_HOST:$POSTGRES_PORT."
