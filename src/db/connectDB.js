import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const connectDB = async ()=>{


    try {

        await mongoose.connect(process.env.MONGODB_URL)
        
    } catch (error) {
        console.log("error occured in db connect in src db file")
    }
}

export default connectDB;