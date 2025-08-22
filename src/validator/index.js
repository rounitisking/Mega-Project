// these are validators -- yah apr koi next nhi hai jiske vajah se hame ye fucntions route mai directly execute krne parenge

import { body } from "express-validator";

const registerUserValidator = ()=>{
    return [
        body("email").trim().isEmail().withMessage("enter a valid email")
        .notEmpty().withMessage("email field is required")
        ,

        body("username").trim()
        .notEmpty().withMessage("username is required")
        .isLength({min : 3}).withMessage("the username should be larger than 3 characters")
        .isLength({max : 10}).withMessage("the username should be less than 10 characters")
    ]
}

const loginUserValidator = ()=>{
    return [
        body("email").trim().isEmail().withMessage("enter a valid email")
        .notEmpty().withMessage("email field is required")
        ,
        body("password").notEmpty().withMessage("password field is required")
    ]
}

export { registerUserValidator};