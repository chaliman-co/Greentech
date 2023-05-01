#!/usr/bin/env bash
echo "setting .env"
cp "/var/www/html/public/.env" .

echo "running npm install..."
npm install

echo "running npm build..."
npm run build

echo "Running composer"
composer global require hirak/prestissimo
composer install --no-dev --working-dir=/var/www/html

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Linking storage folder..."
php artisan storage:link