// hooks are always applied on the userschema 

import mongoose , {Schema} from "mongoose";
import {AvailableUserRoles , userRolesEnum} from "../utils/constants.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema = new Schema({
    id : String,
    avatar: {
        type : {
            url : String,
            Localpath : String // avatar means the picture of the porfile photo so here we are storing the picture of profile in the public images 
        },
        default : {
            url : "https://placehold.co//600x400",
            Localpath : ""
        }
    },

    username : {
        type : String,
        required : false,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    
    email : {
        type : String,
        unique : true,
        required :true
    },
    fullname : {
        type : String,
        required : true
    },

    password :  String,
    oldPassword  : []
    ,

    role  : {
        type : String ,
        enum : AvailableUserRoles,
        default : userRolesEnum.MEMBER
    },

    isEmailverified : {
        type : Boolean,
        default : false
    },

    refreshToken : String,
   

    forgotPwdToken : String,
    
    forgotPwdTokenexpiry : {
        type : Date
    },

    emailVerificationToken  : String,
    
    emailVerificationTokenExpiry  : {
        type: Date
    },

}, {timestamps : true})


userSchema.pre("save" , async function(next){

    if(!this.isModified("password")){ return next()}
     
    this.password = await bcrypt.hash(this.password , 10)

    next()
})

//defining the method for easy work 

// hashing of the password before saving it 
userSchema.methods.isPasswordCorrect = async function(pwd){
    return await bcrypt.compare(pwd, this.password)
}

//generating of the access token -- iska kaam ye hai ki ye api ko batata hai ki user logged in hai 
userSchema.methods.AccessToken =  function(){
        // generation of the json web token 
   return  jwt.sign({
        id : this.id,
        email : this.email,
        username : this.username
    } , process.env.ACCESS_TOKEN_SECRET , {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
        

}

//generating of the refresh token -- refresh token is used to generate the access token without aksing the user to login again and if it expires then user have to login again
userSchema.methods.RefreshToken = function(){
    return jwt.sign({ 
        id : this.id
    },
    process.env.REFRESH_TOKEN_SECRET ,  { expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
}

//generation of the email verification token
//we will be using crypto to generate the token
// here we are storing hashed token in the db 
userSchema.methods.EmailVerificationToken = function (){ // yaha pr methdos ka matlab hai ki ye jo fucntion create hua hai vo mdel ke instance se access hoga agar ham uske jagah statics krde tho vo mdel ke name se access hoga 
    const unhashedToken = crypto.randomBytes(20).toString("hex")
    // const hashedToken = bcrypt.hash(unhashedToken , 10)
    const hashedToken= crypto.createHash("sha256").update(unhashedToken).digest("hex") //.digest returns the hashed token in the format u asked 
    const tokenExpiry = Date.now() + (20*60*1000)
    return {hashedToken , unhashedToken ,tokenExpiry}
}

const User = mongoose.model(  "User" ,userSchema)
export default User
