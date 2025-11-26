#!/bin/sh
# Wait for PostgreSQL to be ready before running migrations
# Usage: ./scripts/wait-for-db.sh && npm run prisma:deploy && npm run seed && node dist/src/index.js

set -e

HOST="${DB_HOST:-db}"
PORT="${DB_PORT:-5432}"
USER="${DB_USER}"
PASSWORD="${DB_PASSWORD}"
TIMEOUT=30
ELAPSED=0

echo "🔍 Waiting for PostgreSQL at $HOST:$PORT..."

while [ $ELAPSED -lt $TIMEOUT ]; do
  if nc -z "$HOST" "$PORT" 2>/dev/null; then
    echo "✅ PostgreSQL is ready!"
    exit 0
  fi
  
  ELAPSED=$((ELAPSED + 1))
  echo "⏳ Attempt $ELAPSED/$TIMEOUT... PostgreSQL not ready yet"
  sleep 1
done

echo "❌ PostgreSQL did not become ready within ${TIMEOUT} seconds"
exit 1
