#!/usr/bin/env bash
#
# start-all.sh — open one Terminal window per service + one for docker-compose (inside backend)

# list of relative paths to start with npm run dev
declare -a SERVICES=(
  "backend/gateway"
  "backend/services/auth-service"
  "backend/services/socket-service"
  "backend/services/submission-service"
  "backend/services/user-service"
  "frontend"
)

# absolute path to project root
ROOT="$(cd "$(dirname "$0")" && pwd)"

# 1) launch Docker stack (compose file lives in backend/)
osascript <<EOF
tell application "Terminal"
  activate
  do script "cd '$ROOT/backend' && docker-compose up; exec \$SHELL"
end tell
EOF
sleep 0.2

# 2) loop through micro-services & frontend
for svc in "${SERVICES[@]}"; do
  FULL="$ROOT/$svc"
  osascript <<EOF
tell application "Terminal"
  activate
  do script "cd '$FULL' && npm install && npm run dev; exec \$SHELL"
end tell
EOF
  sleep 0.2
done
