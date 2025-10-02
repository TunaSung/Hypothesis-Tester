import api from "./api"
import { isAxiosError } from "axios"

// helper
function getErrorMessage(error: unknown, fallback: string): string {
    if(isAxiosError(error)) {
        return (
            (error.response?.data as any)?.message ??
            error.message ??
            fallback
        )
    }
    if(error instanceof Error) return error.message
    if(typeof error === "string") return error
    return fallback 
}

// token
export const saveToken = (token: string, refreshToken?: string): void => {
    localStorage.setItem("token", token)
    localStorage.setItem("tokenSaveAt", Date.now().toString())
    if(refreshToken) localStorage.setItem("refresh_token", refreshToken)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export const clearToken = (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("tokenSaveAt")
    delete api.defaults.headers.common["Authorization"]
}

export const setAuthHeader = (): void => {
    const token = localStorage.getItem("token")
    if(token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
}

// type
export type SignUpResponse = {
    message: string
    user: Record<string, unknown>
}

export type SignInResponse = {
    message: string
    token: string
    refreshToken: string
    user?: Record<string, unknown>
}

export type RefreshTokenRespnse = {
    token: string
}

export type ForgetPasswordResponse = {
    message: string
    refreshToken: string
}

// service
export const signUp = async (
    username: string,
    email: string,
    password: string
): Promise<SignUpResponse> => {
    try {
        const res = await api.post<SignUpResponse>("/auth/signup", {
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password
        })
        return res.data
    } catch (error) {
        throw new Error(getErrorMessage(error, "Sign up failed"))
    }
}

export const signIn = async (
    email: string,
    password: string
): Promise<SignInResponse> => {
    try {
        const res = await api.post<SignInResponse>("/auth/signin", {
            email: email.trim().toLowerCase(),
            password
        })
        const { token, refreshToken } = res.data;
    saveToken(token, refreshToken);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Sign in failed"));
    }
}