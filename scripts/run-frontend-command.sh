#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${FRONTEND_ENV_FILE:-$ROOT_DIR/frontend/.env.local}"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

cd "$ROOT_DIR/frontend"
exec pnpm "$@"
