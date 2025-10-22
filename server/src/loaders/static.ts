import express, { type Express } from "express";
import path from "path";
import { getDirname } from "../config/path.js";

export function registerStatic(app: Express) {
  const __dirname = getDirname(import.meta.url);
  const staticPath = path.join(__dirname, "..", "public");

  app.use(express.static(staticPath));

  // SPA fallback（避免覆蓋 /api/*）
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
