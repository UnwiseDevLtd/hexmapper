FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="hexmapper" \
      org.opencontainers.image.source="https://codeberg.org/UnwiseDev/hexmapper" \
      org.opencontainers.image.licenses="AGPL-3.0-or-later"
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
