#!/usr/bin/env bash
# start-all.sh — open one Windows Terminal window per service via wt.exe

# absolute project root
ROOT="$(cd "$(dirname "$0")" && pwd -P)"

open_wt () {
  local dir="$1"
  local cmd="$2"
  # call Windows' wt.exe through cmd.exe
  cmd.exe /c "wt.exe -w new -d \"$(wslpath -w "$dir")\" \
        wsl.exe -e bash -c 'cd \"$dir\" ; $cmd ; exec bash'"
  sleep 0.2
}

# 1) docker-compose
open_wt "$ROOT/backend" "docker-compose up"

# 2) micro-services + frontend
services=(
  "backend/gateway"
  "backend/services/auth-service"
  "backend/services/socket-service"
  "backend/services/submission-service"
  "backend/services/user-service"
  "frontend"
)
for svc in "${services[@]}"; do
  open_wt "$ROOT/$svc" "npm install && npm run dev"
done
