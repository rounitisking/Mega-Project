import dotenv from "dotenv"
import asyncHandeler from "../utils/async-handeler.js"
import {apiError} from "../utils/api.error.js"
import apiResponse from "../utils/api-response.js"
import User from "../models/user.model.js"
import {userRolesEnum} from "../utils/constants.js"
import { Project } from "../models/project.model.js"
dotenv.config()

// ye adminprojectValidator make mai use hoga
const MakeProjectValidator = asyncHandeler(async (req , res ,next)=>{

    // ye mai isliye bana raha hu taki koi bhi user ake project na create krde unless vo ek admin na ho
//req mai user ki detail hai vaha se user ki id lo then user ko find kro 
//check their role ki kya hai uska role
//if not admin and project admin throw error


        const id = req.user.id
        if(!id){
           return  new res.status(400).json(
                new apiError(400 , "no user id found -- error occured in the permision make project middleware")
            )
        }
        
        const user = User.findOne({id : id})
        if(!user){
           return  new res.status(400).json(
                new apiError(400 , "no user found -- error occured in the permision make project middleware")
            )
        }

        if(user.role != userRolesEnum.ADMIN || user.role != userRolesEnum.PROJECT_ADMIN){
            return res.status(400).json(
                new apiError(400 , "user role mismatched so user cannot make a project")
            )
        }


        next()
        

})


// ye middleware update , delete , getproject members , add project members mai use hoga
const AdminProjectValidator = asyncHandeler(async (req , res ,next)=>{

     // ab yaha ye check krna hai ki user admin tho hai great but kya vo user members mai hai uss project ke ya nhi but ye make project keliye alid nhi hoga
        // ham ismai ye ki req.nody se title lenge the ss title se project find karenge then uske members mai ham req vale bande ko find karenge
        // agar nhi hoga tho error



        const id = req.user.id
        if(!id){
           return  new res.status(400).json(
                new apiError(400 , "no user id found -- error occured in the permision make project middleware")
            )
        }
        
        const user = User.findOne({id : id})
        if(!user){
           return  new res.status(400).json(
                new apiError(400 , "no user found -- error occured in the permision make project middleware")
            )
        }

        if(user.role != userRolesEnum.ADMIN || user.role != userRolesEnum.PROJECT_ADMIN){
            return res.status(400).json(
                new apiError(400 , "user role mismatched so user cannot make a project")
            )
        }

        const {title} = req.body

        const project = Project.findOne({title})

            if(!project){
                return res.status(400).json(
                new apiError(400 , "no such project found, try again")
            )
            }
            isMember = false
            for(let i =0 ; i < project.members.length ; i++){
                if(id == project.members[i]){
                    isMember = true
                }
            }

            if(!isMember){
                return res.status(400).json(
                new apiError(400 , "user request is not in the project")
            )
            }


        next()
        

})

