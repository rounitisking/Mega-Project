import express, { Router } from "express"
import { registerUser } from "../controller/auth.controller.js";
import { valid } from "../middlewares/validator.middleware.js";
import {registerUserValidator} from "../validator/index.js"
const registerUserrouter = Router()

registerUserrouter.post("/register" ,registerUserValidator() , valid , registerUser)
// registerUserrouter.route("/Server").post(registerUserValidator() , valid , registerUser)
export default registerUserrouter;