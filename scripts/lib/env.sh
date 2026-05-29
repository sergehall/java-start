#!/usr/bin/env sh
set -eu

project_root() {
  cd "$(dirname "$0")/../.." && pwd
}

load_env_file() {
  env_file="$1"
  if [ ! -f "$env_file" ]; then
    echo "Missing env file: $env_file" >&2
    exit 1
  fi

  set -a
  # shellcheck disable=SC1090
  . "$env_file"
  set +a
}

read_env_value() (
  env_file="$1"
  env_name="$2"
  fallback="$3"

  if [ -f "$env_file" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$env_file"
    set +a
  fi

  eval "printf '%s\n' \"\${$env_name:-$fallback}\""
)
