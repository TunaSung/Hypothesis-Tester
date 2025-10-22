import express, { type Express } from "express";
import "dotenv/config";
import { corsMiddleware } from "./config/cors.js";
import { registerRoutes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";
import { notFound } from "./middlewares/notFound.js";

export function createApp(): Express {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));

  registerRoutes(app);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
