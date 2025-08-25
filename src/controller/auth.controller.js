import asyncHandeler from "../utils/async-handeler.js"
import User from "../models/user.model.js"
import  apiResponse from "../utils/api-response.js"
import {apiError} from "../utils/api.error.js"
import dotenv from "dotenv"
import {sendMail , EmailOption } from "../utils/mail.js"
import jwt from "jsonwebtoken"
dotenv.config()

const registerUser = asyncHandeler(async (req, res , next)=>{

        const {fullname , email , password , role} = req.body;

        try {
                
                const exsistingUser = await User.findOne({email})

                //checking if the user exsist in the db
                if(exsistingUser){
                       return  res.status(400).json(
                               new apiError(400,"user already exsist in the db, start login")
                        )
                }


                //creating user in the db
                const user = await User.create({fullname , email , password ,role})

                if(!user){
                        return res.status(400).json(
                               new apiError(400 ,"error occured while registering the user")
                        )
                }

                
                //creating a verification token
                const creatingVerifyToken = User.EmailVerificationToken() //returns a object 

                //saving the token in the db
                user.emailVerificationToken = creatingVerifyToken.hashedToken
                await user.save()


                const VerificationUrl = `http://localhost:3000/api/v1/users/emailVerification/${creatingVerifyToken.hashedToken}`

                //sending the email
                const registerUserEmail = EmailOption(
                    {
                                        name : fullname,
                                        intro : "click the verification url",
                                        instructions : `token is valid fot 10 min`,
                                        color : "red",
                                        text : "click the verification token to verify",
                                        link : VerificationUrl
                
                                } , "for any query plz click contact the given email : rounitsingh1405@gmail.com"
                )
                

               const mailSent =  await sendMail( registerUserEmail, email , "Email for Registeration")

                

                if(!mailSent){
                        return res.status(400).json(
                               new apiError(400 , "error occured while sending the email")
                        )
                }

                return res.status(200).json(
                        new apiResponse(200 , {msg : "email send"})
                )

        } catch (error) {
                console.log("error occured while registering the user" ,error)
                return res.status(500).json(
                         new apiError(500, "Internal server error while registering user")
                )
        }
})


const verifyUser = asyncHandeler(async (req, res , next)=>{

       const  {verificationToken} =  req.params

       const user = await User.findOne({emailVerificationToken : verificationToken})

       if(!user){
        return res.status(400).json(
                 new apiError(402 , "no user find while verification")
        )
       }

       if(verificationToken != user.emailVerificationToken){
         return res.status(400).json(
                new apiError(402 , "no user find while verification")
        )
       }


       user.isEmailverified = true;
       user.emailVerificationToken = null;
       await user.save()

       return res.status(200).json(
                 new apiResponse(200 , user , "user is verified")
        )

})




const loginUser = asyncHandeler(async (req, res , next)=>{
        

        const {email , password , username} = req.body

        const user = User.findOne(email)

        if(!user){
              return  res.status(400).json(
                        new apiError(400 , "no user found in the db, plz register first")
                )
        }

        if(!user.isEmailverified){
                return  res.status(400).json(
                        new apiError(400 , "user is not verified, verify the user first")
                )
        }

        if(!user.isPasswordCorrect()){
                return  res.status(400).json(
                        new apiError(400 , "user is not verified, verify the user first")
                )
        }

        //creating of the refresh token and the access token
        const refreshToken = user.RefreshToken()
        const AccessToken = user.AccessToken()


        // saving the access token in the cookies and hame db mai store krne ki koi jarurat nhi hai kyuki ham jwt secret key se verify krte hai token ko
        // hamne refresh token ko db mai dala hai kyuki ham uska use krke access token generate karenge
         user.refreshToken = refreshToken
        await user.save()


                    const cookieOption = {
                        httpOnly : true,
                        secure : true,
                        maxAge : 20*60*600*1000
                    }
                    res.cookie("Accesstoken" , AccessToken ,cookieOption) // the third parameter in this is cookie options 


                    return apiResponse(200 , user , "user has loggedin succesfully")

})


const viewProfileUser = asyncHandeler(async (req, res , next)=>{

        try {
                if(!req.user){
                      return res.status(400).json(apiError(400 ,"errror occured in verify the access token to let the user to see their profile"))
                }

                const user = await User.findById(req.user.id).select("-password")

                res.status(200).json(
                        apiResponse(200 , user , "this is the profile setting")
                )

        } catch (error) {
                console.log("error occured while accessing the profile")
        }
})


const logoutUser = asyncHandeler(async (req, res , next)=>{

        try {
                if(!req.user){
                      return res.status(400).json(apiError(400 ,"errror occured in verify the access token to let the user to see their profile"))
                }

                const user = await User.findById(req.user.id).select("-password")

                user.refreshToken = ""
                await user.save()

                res.cookie("Accesstoken" , "" , {

                expires : new Date(0), // ye JavaScript ka epoch time hota hai → Thu, 01 Jan 1970 00:00:00 GMT  iska matlab hota hai cookie is already expired
                 httpOnly : true
                 })     
                res.status(200).json(
                        apiResponse(200 , "user logged out succesfully")
                )

        } catch (error) {
                console.log("error occured while accessing the profile")
        }
})


const GenerateAccessToken = asyncHandeler(async (req, res , next)=>{
        try {
                
                if(req.user){
                       return  res.status(200).json(
                                apiResponse(200 , "access token is still active")
                        )
                }

                const {email} = req.params
                const user = await User.findOne({email : email})
                if(!user){
                       return res.status(400).json(
                                apiError("user not found while generating the refresh token")
                        )
                }
                //verify the refresh token then generat and assign the access token in the cookies 
                const verifyRefreshToken = jwt.verify(user.refreshToken , process.env.REFRESH_TOKEN_SECRET)

                if(!verifyRefreshToken){
                        return res.status(400).json(
                                apiError("invalid refresh token")
                        )
                }

                const accessToken = await user.AccessToken()

                  const cookieOption = {
                        httpOnly : true,
                        secure : true,
                        maxAge : 20*60*600*1000
                    }
                    res.cookie("Accesstoken" , accessToken ,cookieOption) // the third parameter in this is cookie options 




        } catch (error) {
                console.log("error occured while creating a access token from the refresh token")
        }
})


//forgot pwd , reset pwd and chage current pwd

const ForgetPasswordUser = asyncHandeler(async (req, res , next)=>{
        
        

        const {fullname , email} = req.body
        const user = User.findOne(email)

        if(!user){
        return res.status(400).json(new apiError(400 ,"this email is not registered in the db , error occured in forgot password"))
                
        }

        const mail = EmailOption({
                name : fullname,
                intro : "this mail is to forget the password",
                instructions : "click the following link to change the password",
                color : "blue",
                text : "forgt your password",
                link : `http://localhost:${process.env.PORT}/api/v1/users/changePassword`,
                outro : "for any query contact us on email"
        })

        const Mailsent = sendMail(mail , email , "Forget password!!!!!")

        if(!Mailsent){
          return res.status(400).json(new apiError(400 ,"errror occured while sending the email"))

        }

        return res.status(200).json(
                new apiResponse(200 , "email sent"))


})



const ResetPasswordUser = asyncHandeler(async (req, res , next)=>{
        


        const {fullname , email , password} = req.body

        if(!req.user){
                return res.status(400).json(
                        apiError(400 , "error occured in reseting the password try login again")
                )
        }

        const user = await User.findOne({email , fullname})

        if(!user){
                return res.status(400).json(
                        apiError(400 , "error occured in reseting this email id is not registered")
                )
        }

       const IsPasswordCorrect =  user.isPasswordCorrect()

       if(!IsPasswordCorrect){
        return res.status(400).json(
                        apiError(400 , "incorrect password entered in the reset field try again")
                )
       }

        const mail = EmailOption({
                name : fullname,
                intro : "this mail is to reset the password",
                instructions : "click the following link to change the password",
                color : "blue",
                text : "reset your password",
                link : `http://localhost:${process.env.PORT}/api/v1/users/changePassword`,
                outro : "for any query contact us on email"
        })

        const Mailsent = sendMail(mail , email , "reset password!!!!!")

        if(!Mailsent){
          return res.status(400).json(new apiError(400 ,"errror occured while sending the email"))

        }

        return res.status(200).json(
                new apiResponse(200 , "email sent"))


})



const ChangePasswordUser = asyncHandeler(async (req, res , next)=>{
        // param mai se emial lo and boody mai se pwd 
        // find the user on the basis of the email 
        //logic likho ki abhi ka pwd old pwd se mach nhi krna cahiye 
        // pwd jo user dega usko hash kro and save krdodb mai 

        const {email} = req.params
        const {password} = req.body

        const user = User.findOne({email})

        if(!user){
              return   res.status(400).json(
                        apiError(400 , "no such user found ,-- while changing the password")
                )
        }

        let IsNewPWDSameToOldPassword = false

        for( i in user.oldPassword){
                if(password == i){
                        IsNewPWDSameToOldPassword = true
                        break;
                }
        }

        if(IsNewPWDSameToOldPassword){
                return res.status(400).json(
                        apiError(400 , "the entered password is same to the previous password, try sometihng new")
                )
        }

         user.password = password
         await user.save()


         return res.status(200).json(
                        apiResponse(200 , "password changed succesfully")
                )
        
})

export {registerUser , verifyUser , loginUser , viewProfileUser , logoutUser , GenerateAccessToken
        , ForgetPasswordUser , ChangePasswordUser , ResetPasswordUser
}