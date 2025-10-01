import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { validate } from "../middlewares/validate.js";
import { getDatasetQuerySchema } from "../schemas/dataset.schema.js";
import { uploadDataset, getDatasetMeta } from "../handlers/dataset.handler.js";
import authenticate from "../middlewares/JWT.js";

const router = Router();

// 上傳 CSV
router.post("/upload", authenticate, upload.single("file"), uploadDataset);

// 查 meta
router.get("/meta", validate(getDatasetQuerySchema), getDatasetMeta);

export default router;
