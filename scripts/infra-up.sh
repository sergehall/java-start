#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-local}"

case "$MODE" in
  local) ENV_FILE="$ROOT_DIR/.env.local" ;;
  prod) ENV_FILE="$ROOT_DIR/.env" ;;
  *)
    echo "Usage: scripts/infra-up.sh [local|prod]" >&2
    exit 1
    ;;
esac

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running or not reachable." >&2
  echo "Start Docker Desktop, then run: ./scripts/infra-up.sh $MODE" >&2
  exit 1
fi

echo "Starting PostgreSQL for $MODE. Docker reuses the existing image, container, and volume when available."
docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.local.yml" up -d postgres
"$ROOT_DIR/scripts/db-check.sh" "$MODE"
