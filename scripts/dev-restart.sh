#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

"$ROOT_DIR/scripts/dev-stop.sh"
exec "$ROOT_DIR/scripts/dev.sh"
