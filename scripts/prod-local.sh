#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

# shellcheck disable=SC1091
. "$ROOT_DIR/scripts/lib/env.sh"
load_env_file "$ENV_FILE"

"$ROOT_DIR/scripts/db-check.sh" prod

cd "$ROOT_DIR/frontend"
pnpm build

cd "$ROOT_DIR/backend"
./mvnw -DskipTests package
java -jar target/java-start-backend-0.1.0-SNAPSHOT.jar &
BACKEND_PID="$!"

cd "$ROOT_DIR/frontend"
pnpm start &
FRONTEND_PID="$!"

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT
wait
