import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { signIn, signUp, refreshToken, forgotPassword } from "../handlers/auth.handler.js";
import { signInSchema, signUpSchema, refreshTokenSchema, forgotPasswordSchema } from "../schemas/auth.shema.js";

const router = Router();

router.post("/signup", validate(signUpSchema), signUp)
router.post("/signin", validate(signInSchema), signIn)
router.post("/refresh", validate(refreshTokenSchema), refreshToken)
router.post("/forget", validate(forgotPasswordSchema), forgotPassword)

export default router