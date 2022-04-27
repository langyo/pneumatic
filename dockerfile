FROM nginx:mainline
WORKDIR /app
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist /app
