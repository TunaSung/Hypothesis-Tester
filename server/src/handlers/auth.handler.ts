import type { RequestHandler } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { User } from "../models/Association.js"
import type { SignInBody, SignUpBody, RefreshTokenBody, ForgotPasswordBody } from "../schemas/auth.shema.js"

function pickSafeUser(u: any) {
    const plain = typeof u?.get === "function" ? u.get({ plain: true }) : u;
    const { password, ...rest } = plain ?? {};
    return rest;
}

export const signUp: RequestHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body as SignUpBody;
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, email, password: hashedPassword })
        res.status(201).json({ 
            message: 'sign up successful', 
            user: pickSafeUser(newUser) 
        })
    } catch (e: any) {
        if (e?.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ error: "Email already in use" });
        }
        const errorMessage = e instanceof Error ? e.message : String(e)
        return res.status(500).json({ error: "Sign up failed", details: errorMessage });
    }
};

export const signIn: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body as SignInBody;

        const user = await User.findOne({ where: { email } })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Wrong email or password' })
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            return res.status(500).json({ message: "未設定 JWT_SECRET" });
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "3h" })
        res.status(200).json({ 
            message: `Login successful`, 
            token, 
            user: pickSafeUser(user) 
        })
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e)
        res.status(500).json({ 
            error: 'Login failed', 
            details: errorMessage 
        })
    }
}

export const refreshToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body as RefreshTokenBody;
  const secret = process.env.JWT_SECRET!;
  try {
    const decoded = jwt.verify(refreshToken, secret) as { userId: number };
    const token = jwt.sign({ userId: decoded.userId }, secret, { expiresIn: "3h" });
    return res.json({ token });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

export const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body as ForgotPasswordBody;
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }
  // 通常會生成一次性 token，寄 email link
  const secret = process.env.JWT_SECRET!;
  const resetToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" });
  return res.json({ message: "Password reset link generated", resetToken });
}