# syntax=docker/dockerfile:1
# ==== Build client ====
FROM node:20-alpine AS clientbuild
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ==== Build server ====
FROM node:20-alpine AS serverbuild
WORKDIR /app/server
COPY server/package*.json ./
# 建置階段需要 devDeps (typescript)
RUN npm ci
COPY server/ ./
RUN npm run build  # 產出 /app/server/dist

# ==== Runtime ====
FROM node:20-alpine AS runner
WORKDIR /app/server
ENV NODE_ENV=production PORT=8080

# 只裝 prod 依賴
COPY server/package*.json ./
RUN npm ci --omit=dev

# 從前面兩個 stage 複製成果
COPY --from=serverbuild /app/server/dist ./dist
COPY --from=clientbuild /app/client/dist ./public

EXPOSE 8080
CMD ["node", "dist/server.js"]
