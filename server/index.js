import express from "express"
import dotenv from "dotenv"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/genrate.route.js"
import pdfRouter from "./routes/pdf.route.js"
import creditRouter from "./routes/credits.route.js"
import { stripeWebhook } from "./controllers/credits.controller.js"
dotenv.config()




const app = express()

app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://examnotesai-goo1.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, postman, curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      return callback(null, true)
    }
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}))

app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000
app.get("/",(req,res)=>{
    res.json({message:"ExamNotes AI Backend Running 🚀"})
})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/notes", notesRouter)
app.use("/api/pdf", pdfRouter)
app.use("/api/credit", creditRouter)
app.use("/api/credits", creditRouter)



app.listen(PORT,()=>{
    console.log(`✅ Server running on port ${PORT}`)
    connectDb()
})
