import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { getDatasetQuerySchema } from "../schemas/dataset.schema.js";
import { uploadDataset, getDatasetMeta } from "../handlers/dataset.handler.js";

const router = Router();

// 上傳 CSV
router.post("/upload", upload.single("file"), uploadDataset);

// 查 meta
router.get("/meta", validate(getDatasetQuerySchema), getDatasetMeta);

export default router;
