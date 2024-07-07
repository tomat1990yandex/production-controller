# Используем offical image node slim для бэкенда
FROM node:slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем исходники TypeScript
COPY . .

# Сборка TypeScript кода
RUN npm run build

# Определяем порт, который будет использоваться приложением
EXPOSE 5000

# Команда для запуска сервера
CMD ["node", "dist/app.js"]
