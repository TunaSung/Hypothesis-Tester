import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/JWT.js"
import { suggestSchema, runAnalysisSchema } from "../schemas/analysis.schema.js";
import { suggest, runAnalysis, getHistory } from "../handlers/analysis.handler.js";

const router = Router();

router.post("/suggest", validate(suggestSchema), suggest)
router.post("/run", authenticate, validate(runAnalysisSchema), runAnalysis)
router.get("/history", authenticate, getHistory)

export default router;
