FROM node:18.12-alpine as builder

WORKDIR /app

COPY . .

RUN npm install

ARG BUILD_ENV

RUN npm run build

FROM nginx:alpine

WORKDIR /app

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist/app .

EXPOSE 80