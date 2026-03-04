//server.js
import app from "./src/app.js"
import { connectDB } from "./src/config/db.js"
import { config } from "dotenv"
config()

connectDB()

app.listen(3000, ()=>{console.log("conectao en puero 3000")})