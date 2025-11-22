FROM node:21-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY vite.config.js ./
COPY resources/js resources/js/
COPY resources/css resources/css/

RUN npm install
RUN npm run build

FROM php:8.2-fpm-alpine AS final

RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    mysql-client \
    git \
    build-base \
    libxml2-dev \
    oniguruma-dev \
    && rm -rf /var/cache/apk/*

RUN docker-php-ext-install pdo_mysql opcache bcmath

WORKDIR /var/www/html

COPY --from=build /app/public/build public/build

COPY . .

RUN mkdir -p storage/app/public/profile_photos
COPY default.png storage/app/public/profile_photos/default.png

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

COPY .docker/php.ini /usr/local/etc/php/conf.d/zzz-custom.ini

CMD ["php-fpm"]