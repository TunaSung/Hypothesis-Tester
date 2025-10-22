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
RUN npm ci --omit=dev
COPY server/ ./
    
COPY --from=client /app/client/dist ./public

ENV PORT=3030 NODE_ENV=production
EXPOSE 3030
CMD ["node", "server.js"]
