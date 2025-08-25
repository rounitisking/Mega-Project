import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const connectDB = async ()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("error occurred in db connect in src db file:", error.message)
        process.exit(1)
    }
}

export default connectDB;