import jwt from "jsonwebtoken"

export const getToken = async (userId) => {
    try {
        const secret = process.env.JWT_SECRET || "examnotesai_jwt_secret_key_2026"
        const token = jwt.sign({ userId }, secret, { expiresIn: "7d" })
        return token
    } catch (error) {
        console.error("Token generation error:", error)
        throw error
    }
}