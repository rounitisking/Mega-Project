import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import asyncHandeler from "../utils/async-handeler.js"
import { apiError } from "../utils/api.error.js"
import apiResponse from "../utils/api-response.js"
dotenv.config()

const verifyUserToLogin = asyncHandeler(async (req , res , next)=>{
        try {
            
            const Accesstoken = req.cookies?.Accesstoken

            if(!Accesstoken){
                return res.status(400).json(
                    apiError(400 , "no access token present, plz login again")
                )
            }

            // verifying with the jwt secret
            const verify = jwt.verify(Accesstoken , process.env.ACCESS_TOKEN_SECRET)

            if(!verify){
                return res.status(400).json(
                    apiError(400 , "no access token present, plz login again")
                )
            }

            req.user = verify


        } catch (error) {
            console.log("error occured while verifying the access token")
        }
})

export {verifyUserToLogin}
