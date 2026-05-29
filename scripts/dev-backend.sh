#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

if [ "${SKIP_DB_CHECK:-0}" != "1" ]; then
  "$ROOT_DIR/scripts/db-check.sh" local
fi

cd "$ROOT_DIR/backend"
exec ./mvnw spring-boot:run
