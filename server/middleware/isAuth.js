import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({ message: "Token is not found" })
        }
        const secret = process.env.JWT_SECRET || "examnotesai_jwt_secret_key_2026"
        const verifyToken = jwt.verify(token, secret)
        if (!verifyToken || !verifyToken.userId) {
            return res.status(401).json({ message: "User doesn't have valid token" })
        }
        req.userId = verifyToken.userId
        next()
    } catch (error) {
        return res.status(401).json({ message: `Authentication error: ${error.message}` })
    }
}
export default isAuth