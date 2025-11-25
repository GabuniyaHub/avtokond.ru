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
# node_modules, папку dist, папку prisma, .env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY .env ./.env

EXPOSE 3000

# Запускаем скомпилированный файл
CMD ["node", "dist/src/index.js"]