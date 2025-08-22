import { validationResult } from "express-validator";
import {apiError} from "../utils/api.error"
const valid = (req,res , next)=>{
    const error = validationResult(req)

    if(error.isEmpty()){
        return next()
    }

    const extractedError = []
    error.array().map((err)=>{ extractedError.push({
        [err.path] : err.msg
    })})

    throw new apiError(400 , "something went wrong" , extractedError)
}

export {valid}