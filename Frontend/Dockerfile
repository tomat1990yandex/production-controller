# Используем offical image node slim для фронтенда
FROM node:slim as build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Собираем приложение
RUN npm run build

# Второй этап, для production использовать nginx
FROM nginx:alpine

# Копируем собранные файлы React из предыдущего этапа в nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурационный файл nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Определяем порт, который будет использоваться nginx
EXPOSE 80

# Команда для запуска nginx
CMD ["nginx", "-g", "daemon off;"]
