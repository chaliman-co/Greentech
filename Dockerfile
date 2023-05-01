# syntax = docker/dockerfile:1.2
FROM richarvey/nginx-php-fpm:3.1.4

COPY . .

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN apk add --update nodejs npm                  
RUN --mount=type=secret,id=_env,dst=/var/www/html/.env cp /var/www/html/.env /var/www/html/public/.env
CMD ["/start.sh"]