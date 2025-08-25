import { validationResult } from "express-validator";
import {apiError} from "../utils/api.error.js"
const valid = (req,res , next)=>{
    const error = validationResult(req)

    if(!error.isEmpty()){
       const extractedError = []
        error.array().map((err)=>{ extractedError.push({
            [err.path] : err.msg
        })})
        
        return next(new apiError(400 , "something went wrong" , extractedError))
    }
    
    next()

    
}

export {valid}