# Stage 1: Build the Astro project
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the codebase and build
COPY public/ ./public/
COPY src/ ./src/
COPY astro.config.mjs ./
COPY tailwind.config.mjs ./
COPY tsconfig.json ./
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginxinc/nginx-unprivileged:alpine

# Copy our custom, highly-optimized Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built static files from the builder stage to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 and start Nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
