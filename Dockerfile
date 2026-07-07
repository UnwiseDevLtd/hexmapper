# build stage: compile src/*.js -> dist/app.js (no deps, no modules)
FROM node:22-alpine AS build
WORKDIR /app
COPY build.js package.json ./
COPY src src
RUN node build.js

# serve stage: static nginx
FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="hexmapper" \
      org.opencontainers.image.source="https://codeberg.org/UnwiseDev/hexmapper" \
      org.opencontainers.image.licenses="AGPL-3.0-or-later"
COPY index.html /usr/share/nginx/html/index.html
COPY --from=build /app/dist/app.js /usr/share/nginx/html/dist/app.js
EXPOSE 80
