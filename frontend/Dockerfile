FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install

COPY . .
RUN npm run build

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/dist ./dist