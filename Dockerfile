# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY server/package*.json server/
COPY client/package*.json client/
RUN npm ci --prefix server
RUN npm ci --prefix client

# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/server/node_modules server/node_modules
COPY --from=deps /app/client/node_modules client/node_modules
COPY server server
COPY client client
RUN npm run build --prefix server
RUN npm run build --prefix client

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# 只裝 server 的 prod 依賴
COPY server/package*.json server/
RUN npm ci --omit=dev --prefix server

# 複製建置成果
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/client/dist client/dist

EXPOSE 8080
CMD ["node", "server/dist/server.js"]
