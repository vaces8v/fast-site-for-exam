# Используем минимальный Node
FROM node:20-alpine AS base
WORKDIR /app

# Кэшируем установки зависимостей
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

# Копируем остальной код
COPY . .

# Сборка
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app .
EXPOSE 3000
CMD ["npm", "start"] 