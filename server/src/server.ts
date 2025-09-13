import express from "express"
import cors from "cors"
import 'dotenv/config'

import "./models/Association.js"
import datasetRouter from "./routes/dataset.route.js";
import analysisRouter from "./routes/analysis.route.js";
import { errorHandler } from "./middlewares/error.js";
import { sqlize } from "./config/db.js";


const app = express()

const origins = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");

const corsOptions = {
  origin: origins,
  credentials: true, // ← 這行會讓 res header 帶上 Access-Control-Allow-Credentials: true
};

app.use(cors(corsOptions)); // 全域套用
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/dataset", datasetRouter);
app.use("/api/analysis", analysisRouter);

sqlize.sync().then(() => {
    console.log("資料庫已同步");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})