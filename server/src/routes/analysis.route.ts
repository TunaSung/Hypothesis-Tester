import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/JWT.js";
import {
  suggestSchema,
  runAnalysisSchema,
  listAnalysesByIdKeysetSchema
} from "../schemas/analysis.schema.js";
import {
  suggest,
  runAnalysis,
  listAnalysesByIdKeyset
} from "../handlers/analysis.handler.js";

const router = Router();

router.post("/suggest", validate(suggestSchema), suggest);
router.post("/run", authenticate, validate(runAnalysisSchema), runAnalysis);
router.get("/history/keyset", authenticate, validate(listAnalysesByIdKeysetSchema), listAnalysesByIdKeyset);

export default router;
