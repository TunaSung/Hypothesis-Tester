import type { Express } from "express";
import datasetRouter from "./dataset.route.js";
import analysisRouter from "./analysis.route.js";
import authRouter from "./auth.route.js";

export function registerRoutes(app: Express) {
  app.use("/api/dataset", datasetRouter);
  app.use("/api/analysis", analysisRouter);
  app.use("/api/auth", authRouter);

  app.get("/health", (_req, res) => res.send("OK"));
}
