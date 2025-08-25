// these are validators -- yah apr koi next nhi hai jiske vajah se hame ye fucntions route mai directly execute krne parenge
// ye wih message tab chalta hai jab condition false ho jati hai 
import { body, param } from "express-validator";

const registerUserValidator = ()=>{
    return [
        body("email").trim()
        .notEmpty().withMessage("email field is required")
        .isEmail().withMessage("enter a valid email")
        ,

        body("fullname").trim()
        .notEmpty().withMessage("fullname field is required")
        .isLength({min : 3}).withMessage("the fullname should be larger than 3 characters")
        
        
        ,

        
        body("password").trim()
        .notEmpty().withMessage("pasword field is required")
        .isLength({min : 6}).withMessage("password should be larger tthan 6 characters")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("one special character is required in teh password")
        .matches(/(?=.*[a-z])/).withMessage("lowercase letter should also be there in the password")   
        .matches(/(?=.*[A-Z])/).withMessage("uppercase letter should also be there in the password")
        ,

        body("role").trim()
        .notEmpty().withMessage("role field is required")
    ]
}


const verifyUserValidator = ()=>{
    return [
        param("verificationToken").trim()
        .notEmpty().withMessage("verification token is required before submitting the form")
        
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

export { registerUserValidator, loginUserValidator , verifyUserValidator} ;