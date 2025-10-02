import { z } from "zod"

// 
export const signUpSchema = z.object({
    body: z.object({
        username: z.string().min(2).max(15),
        email: z.string().email().max(25),
        password: z.string().min(6).max(30)
    }).strict(),

    query: z.object({}).strict(),
    params: z.object({}).strict()
})
export type SignUpBody = z.infer<typeof signUpSchema>["body"];

export const signInSchema = z.object({
    body: z.object({
        email: z.string().email().max(25),
        password: z.string().min(6).max(30)
    }).strict(),

    query: z.object({}).strict(),
    params: z.object({}).strict()
})
export type SignInBody = z.infer<typeof signInSchema>["body"];

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }).strict(),

  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>["body"];

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>["body"];