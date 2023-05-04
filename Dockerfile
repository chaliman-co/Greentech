# syntax = docker/dockerfile:1.2
FROM richarvey/nginx-php-fpm:3.1.4


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

# Install node and npm
RUN apk add --update nodejs npm

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# To trigger composer install
COPY composer.json .

# Install composer dependencies
RUN composer install --no-dev 
# --working-dir=/var/www/html


# To trigger npm run
COPY package.json .

# install npm dependencies
RUN npm install
          
COPY . .    

CMD ["/start.sh"]