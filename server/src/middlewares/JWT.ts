import type { RequestHandler } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import { User } from "../models/Association.js"

interface AccessTokenPayload extends JwtPayload {
    userId: number
}

const authenticate: RequestHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "未提供身份證令牌" });
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            return res.status(500).json({ message: "未設定 JWT_SECRET" });
        }

        const decode = jwt.verify(token, secret) as AccessTokenPayload
        const user = await User.findByPk(decode.userId)

        if (!user) {
            return res.status(404).json({ message: `用戶不存在ㄝdecoded: ${JSON.stringify(decode)}` })
        }

        req.user = user
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "身份驗證令牌已過期" });
        }
        return res.status(401).json({ message: "無效的身份驗證令牌" });
    }
};

export default authenticate;