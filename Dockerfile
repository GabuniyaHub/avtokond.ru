# === ЭТАП СБОРКИ (Builder Stage) ===
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Копируем только файлы для установки зависимостей (для кеширования)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем схему Prisma и генерируем клиента для TypeScript
COPY prisma ./prisma
RUN npx prisma generate

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript (папка dist)
RUN npm run build

# === ЭТАП ПРОДАКШЕНА (Production Stage) ===
# Используем минимальный образ для меньшего размера
FROM node:18-bullseye-slim

WORKDIR /app

# Копируем только то, что нужно для запуска:
# node_modules, папку dist, папку prisma, scripts, public, .env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/public ./public
COPY .env ./.env

# Ensure system certificates and OpenSSL are present for Prisma and TLS
# Also install netcat-openbsd and curl for health checks and wait scripts
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl netcat-openbsd curl \
    && rm -rf /var/lib/apt/lists/*

# Make wait-for-db script executable
RUN chmod +x /app/scripts/wait-for-db.sh

EXPOSE 3000

# Wait for DB to be ready, run migrations, seed, then start the server
CMD sh -c "/app/scripts/wait-for-db.sh && npm run prisma:deploy && npm run seed && node dist/src/index.js"