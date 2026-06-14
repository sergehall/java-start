#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CYRILLIC_PATTERN='\p{Cyrillic}'

if rg --hidden -n "$CYRILLIC_PATTERN" "$ROOT_DIR" \
  -g '!**/.git/**' \
  -g '!**/.idea/**' \
  -g '!**/.vscode/**' \
  -g '!**/.codex/**' \
  -g '!**/.agents/**' \
  -g '!**/node_modules/**' \
  -g '!**/.next/**' \
  -g '!**/target/**' \
  -g '!**/coverage/**' \
  -g '!**/dist/**' \
  -g '!**/.env' \
  -g '!**/.env.*'; then
  echo "Project language check failed: Cyrillic text was found." >&2
  exit 1
fi

echo "Project language check passed: no Cyrillic text found."
