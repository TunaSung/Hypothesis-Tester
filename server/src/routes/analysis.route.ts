import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { suggestSchema, runAnalysisSchema } from "../schemas/analysis.shema.js";
import { suggest, runAnalysis } from "../handlers/analysis.handler.js";
import authenticate from "../middlewares/JWT.js"

const router = Router();

router.post("/suggest", validate(suggestSchema), suggest);
router.post("/run", authenticate, validate(runAnalysisSchema), runAnalysis);

export default router;
