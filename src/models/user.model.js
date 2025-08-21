import mongoose , {Schema} from "mongoose";
import {AvailableUserRoles , userRolesEnum} from "../utils/constants.js"
const userSchema = new Schema({
    id : String,
    avatar: {
        type : {
            url : String,
            Localpath : String // avatar means the picture of the porfile photo so here we are storing the picture of profile in the public images 
        },
        default : {
            url : "https://placehold.co//600X400"
        }
    },

    fullname : String,
    
    email : String,

    password :  String,

    role  : {
        type : string ,
        enum : AvailableUserRoles,
        default : userRolesEnum.MEMBER
    },

    isverified : {
        type : Boolean,
        default : false
    },

    refreshToken : String,

    forgotPwdToken : String,
    
    forgotPwdTokenexpiry : {
        type : Date,
        default : Date.now
    },

    emailVerificationToken  : String,
    
    emailVerificationToken  : {
        type: Date,
        default : Date.now
    },

}, {timestamps : true})

export const user = mongoo