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
