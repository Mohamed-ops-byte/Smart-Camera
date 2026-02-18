# استخدم هذا الملف لتشغيل النظام باستخدام Docker

FROM php:8.4-fpm

# تثبيت المتطلبات
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    zip \
    unzip \
    sqlite3 \
    && docker-php-ext-install pdo_sqlite

# تثبيت Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# نسخ الملفات
COPY . /app

# تثبيت المكتبات
RUN composer install --no-interaction --no-dev --prefer-dist --no-scripts

# تجهيز قاعدة البيانات
RUN touch database/database.sqlite
RUN mkdir -p bootstrap/cache && chmod -R 775 storage bootstrap/cache

# تشغيل الخادم
CMD ["sh", "-c", "mkdir -p storage/framework/cache storage/framework/views storage/framework/sessions bootstrap/cache; chmod -R 775 storage bootstrap/cache; php artisan serve --host=0.0.0.0 --port=8000"]
