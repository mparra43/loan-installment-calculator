# ---------------------------------------
# Stage 1: Backend Builder
# ---------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Copiamos archivos de dependencias
COPY backend/package*.json ./
RUN npm ci

# Copiamos el código fuente y construimos
COPY backend/ .
RUN npm run build

# ---------------------------------------
# Stage 2: Backend Production
# ---------------------------------------
FROM node:20-alpine AS backend
ENV NODE_ENV=production
WORKDIR /app

# Instalamos solo dependencias de producción
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copiamos el build desde el stage anterior
COPY --from=backend-builder /app/backend/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]

# ---------------------------------------
# Stage 3: Frontend Builder
# ---------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copiamos archivos de dependencias
COPY frontend/package*.json ./
RUN npm ci

# Copiamos el código fuente y el .env para variables de build (Vite)
COPY frontend/ .
COPY .env ./.env

RUN npm run build

# ---------------------------------------
# Stage 4: Frontend Production
# ---------------------------------------
FROM nginx:alpine AS frontend

# Copiamos los estáticos generados al servidor Nginx
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copiamos la configuración personalizada de Nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]