#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR/backend"
./mvnw spotless:check
./mvnw test

cd "$ROOT_DIR/frontend"
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
