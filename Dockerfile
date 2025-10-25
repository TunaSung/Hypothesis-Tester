# ==== Build client ====
FROM node:20-alpine AS client
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci
COPY client/ ./

RUN npm run build

# ==== Build server ====
FROM node:20-alpine AS server
WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build
    
# ==== Runtime ====
FROM node:20-alpine AS runner
WORKDIR /app/server
ENV NODE_ENV=production PORT=8080
# 只裝 production 依賴
COPY server/package*.json ./
RUN npm ci --omit=dev
# 複製已編譯好的 dist 與 public
COPY --from=server-build /app/server/dist ./dist
COPY --from=client /app/client/dist ./public
EXPOSE 8080
# 這裡要對到 dist/server.js
CMD ["node", "dist/server.js"]
