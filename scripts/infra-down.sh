#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-local}"
VOLUME_FLAG="${2:-}"

case "$MODE" in
  local) ENV_FILE="$ROOT_DIR/.env.local" ;;
  prod) ENV_FILE="$ROOT_DIR/.env" ;;
  *)
    echo "Usage: scripts/infra-down.sh [local|prod] [--volumes]" >&2
    exit 1
    ;;
esac

if [ "$VOLUME_FLAG" = "--volumes" ]; then
  docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.local.yml" down --volumes
else
  docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.local.yml" stop postgres
fi
