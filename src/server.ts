import mongoose from "mongoose"
import path from "path"
import dotenv from "dotenv"
import app from "./app"
dotenv.config()

//env variables
const PORT = process.env.PORT ?? 3000;
const MONGO_URL = process.env.MONGO_URL;

//mongo connection with mongoose
mongoose.connect(MONGO_URL as string, {}).then((data)=> {
    console.log("mongo db is successfully connected")
    app.listen(PORT, ()=> {
        console.log(`app is running in port ${PORT}`)
    })
}).catch((err)=> {
    console.log(err)
})