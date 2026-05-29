#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"

stop_pid_tree() {
  pid="$1"

  if [ -z "$pid" ] || ! kill -0 "$pid" 2>/dev/null; then
    return
  fi

  if command -v pgrep >/dev/null 2>&1; then
    for child_pid in $(pgrep -P "$pid" 2>/dev/null || true); do
      stop_pid_tree "$child_pid"
    done
  fi

  kill "$pid" 2>/dev/null || true
}

stop_from_file() {
  pid_file="$1"

  if [ ! -f "$pid_file" ]; then
    return
  fi

  pid="$(cat "$pid_file")"
  stop_pid_tree "$pid"
  rm -f "$pid_file"
}

stop_from_file "$RUN_DIR/dev.pid"
sleep 1
stop_from_file "$RUN_DIR/backend.pid"
stop_from_file "$RUN_DIR/frontend.pid"

echo "Development processes are stopped."
