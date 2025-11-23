import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/Association.js";
import type {
  SignInBody,
  SignUpBody,
  RefreshTokenBody /*ForgotPasswordBody*/,
} from "../schemas/auth.schema.js";

/**
 * 不把密碼回傳到前端
 * 目前還沒有要用到純 JS 物件的功能
 * 之後如果有要直接傳純 JS 物件給前端也可以用
 */
function pickSafeUser<
  T extends { get?: (opts?: any) => any; password?: string }
>(u: T) {
  const plain =
    typeof u?.get === "function" ? u.get({ plain: true }) : (u as any);
    // 用 typeof u?.get === "function" 來判斷 u 是不是像 Sequelize instance
    // 是的話用 u.get({ plain: true }) 將其從 Sequelize instance 轉成 JS 物件，這樣才能把敏感資料拿掉
  const { password, ...rest } = plain ?? {};
  return rest as Omit<typeof plain, "password">;
}


/**
 * 註冊
 */
export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body as SignUpBody;
    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "sign up successful",
      user: pickSafeUser(newUser),
    });
  } catch (e: any) {
    if (e?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email already in use" });
    }
    next(e);
  }
};

/**
 * 登入
 */
export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as SignInBody;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Wrong email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: `Login successful`,
      token,
      refreshToken,
      user: pickSafeUser(user),
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({
      error: "Login failed",
      details: errorMessage,
    });
  }
};

/**
 * Refresh Token
 */
export const refreshToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body as RefreshTokenBody;
  if (!refreshToken)
    return res.status(400).json({ error: "Missing refresh token" });

  const secret = process.env.REFRESH_SECRET!;
  try {
    const decoded = jwt.verify(refreshToken, secret) as { userId: number };
    const token = jwt.sign({ userId: decoded.userId }, secret, {
      expiresIn: "3h",
    });
    return res.json({ token });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

/**
 * 之後要完成的 忘記密碼
 */
// export const forgotPassword: RequestHandler = async (req, res) => {
//     const { email } = req.body as ForgotPasswordBody;
//     const user = await User.findOne({ where: { email: email.toLowerCase() } });
//     if (!user) {
//         return res.status(404).json({ error: "Email not found" });
//     }
//     const secret = process.env.JWT_SECRET!;
//     const resetToken = jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" });
//     return res.json({ message: "Password reset link generated", resetToken });
// }
