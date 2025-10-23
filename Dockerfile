# --- build ---
FROM node:20-alpine AS build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server .        
RUN npm run build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/server/dist ./dist
EXPOSE 8080
CMD ["node","dist/server.js"]
