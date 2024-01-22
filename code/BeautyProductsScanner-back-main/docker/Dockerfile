FROM node:18.12-alpine as builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:18.12-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]