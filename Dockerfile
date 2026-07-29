# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — dependencias
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# ---------------------------------------------------------------------------
# Stage 2 — build de producción
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Vite inlina las VITE_* en tiempo de build, no de ejecución: si el backend
# vive en otra URL hay que pasarla aquí, no como variable del contenedor.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Las capas del Chocó suman ~320 MB de GeoJSON y comprimen cerca de 10x.
# Pre-comprimirlas aquí deja que nginx las sirva con gzip_static, sin gastar
# CPU comprimiendo un archivo de 100 MB en cada request.
RUN find dist -type f \
      \( -name '*.geojson' -o -name '*.json' -o -name '*.js' \
         -o -name '*.css' -o -name '*.svg' -o -name '*.map' \) \
      -size +1k -exec gzip -6 -k -f {} \;


# ---------------------------------------------------------------------------
# Stage 3 — servidor de desarrollo (docker compose --profile dev up dev)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS dev

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

# --host expone el server fuera del contenedor; --no-open evita que Vite
# intente abrir un navegador que aquí no existe.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--no-open"]


# ---------------------------------------------------------------------------
# Stage 4 — runtime (stage por defecto)
# ---------------------------------------------------------------------------
FROM nginx:alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
