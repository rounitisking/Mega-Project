import express, { Router } from "express"
import { registerUser , verifyUser , ForgetPasswordUser} from "../controller/auth.controller.js";
import { valid } from "../middlewares/validator.middleware.js";
import {registerUserValidator , verifyUserValidator } from "../validator/auth.validator.js"
import {verifyUserToLogin} from "../validator/Login.user.validator.js"
const registerUserrouter = Router()

registerUserrouter.post("/register" ,registerUserValidator() , valid , registerUser)
// registerUserrouter.route("/Server").post(registerUserValidator() , valid , registerUser)

registerUserrouter.post("/verify" , verifyUserValidator() , valid , verifyUser)


registerUserrouter.post("/forgotPassword" , ForgetPasswordUser)

export default registerUserrouter;