# === ЭТАП СБОРКИ (Builder Stage) ===
FROM node:18-alpine AS builder

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
FROM node:18-alpine

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

EXPOSE 3000

# Запускаем скрипт миграций и затем сервер
CMD sh -c "npm run prisma:deploy && npm run seed && node dist/src/index.js"