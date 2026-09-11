import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"


const isProduction = process.env.NODE_ENV === "production"

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const displayName = name || email.split("@")[0] || "User"
        let user = await UserModel.findOne({ email })
        if (!user) {
            user = await UserModel.create({
                name: displayName,
                email
            })
        }

        const token = await getToken(user._id)
        res.cookie("token", token, cookieOptions)
        return res.status(200).json(user)
    } catch (error) {
        console.error("googleAuth error:", error)
        return res.status(500).json({ message: `Google authentication failed: ${error.message}` })
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        })
        return res.status(200).json({ message: "LogOut Successfully" })
    } catch (error) {
        console.error("logOut error:", error)
        return res.status(500).json({ message: `Logout error: ${error.message}` })
    }
}