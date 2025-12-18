FROM node:18-alpine AS build

WORKDIR /app
COPY package.json ./

RUN npm i
COPY . .

RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443