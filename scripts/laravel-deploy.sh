#!/usr/bin/env bash
echo "setting .env"
cp "/etc/secrets/.env" .



echo "running npm build..."
npm run build



echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Linking storage folder..."
php artisan storage:link