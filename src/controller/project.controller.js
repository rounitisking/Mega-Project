// controllers to make are - 1. get porject - means get all the project 2. get porjetc by id - means get single project    6. addmember to project  7.gte porject memebers   9. update project member role 10. delete member


import {Project}  from "../models/project.model.js"
import User from "../models/user.model.js"
import asyncHandeler from "../utils/async-handeler.js"
import  apiResponse from "../utils/api-response.js"
import {apiError} from "../utils/api.error.js"
import dotenv from "dotenv"
import {sendMail , EmailOption } from "../utils/mail.js"
import jwt from "jsonwebtoken"
import { useReducer } from "react"
dotenv.config()

const MakeProject = asyncHandeler(async (req , res  , next)=>{

        // tile , discription , status  , created by , members -- user se lo 
        //validation vaha ho jayega 
        // in sab deta ko store kr vao db mai 
        
        // yaha pr admin ka and members ka email ayega
        const {title  , discription , createdBy , status , members} = req.body
        
        const projectAdmin = User.findOne({createdBy})
        
        if(!projectAdmin){
           return  res.status(400).json(
                apiError(400 , "The projectAdmin user does not exsist plz change the projectAdmin")
            )
        }

        Project.createdBy = projectAdmin.id
        
        const isNoProjectMember = false
        for(i in members){
            const ProjectMembers = User.findOne({email : i})
            if(!ProjectMembers){
              isNoProjectMember = true
                break
            }
        else{
            Project.members.push(ProjectMembers.id)}
        }

        if(isNoProjectMember){
             return res.status(400).json(
                    apiError(400 , "no members included in this project")
                )
        }

        await Project.save()

        res.status(200).json(
            apiResponse(200 ,"project created successfully" )
        )

    


})  


const UpdateProject = asyncHandeler(async (req, res , next)=>{

        // title , discription , member ko upate kr skte hai , created by ko update kr skte hia , status ko 
        // member ko add ya delete krna hia 

         const {title  , discription , createdBy , status } = req.body

         const project = Project.findOne({title})

         if(!project){
           return res.status(400).json(
                apiError(400 ,"No such porject found !!! enter a valid project name")
            )
         }

         if(title != null){
                project.title = title
         }

         if(discription != null){
                project.discription = discription
         }

         if(createdBy != null){
                const ProjectAdmin = User.findOne({createdBy})

                if(!ProjectAdmin){
                     res.status(400).json(
                apiError(400 ,"enter a valid email")
            )
                }

                project.createdBy = projectAdmin.id
         }

         if(status != null){
                project.status = status
         }

         
         await project.save()

          res.status(200).json(
                apiResponse(200 ,"project Updated")
            )


})


const DeleteProject = asyncHandeler(async (req, res ,next)=>{

    // title input mai lo 
    // uss project ko find kro 
    //project ki sari values ko empty krdo

    const {title} = req.body

        const project = Project.findOne({title})

         if(!project){
           return res.status(400).json(
                apiError(400 ,"No such porject found !!! enter a valid project name")
            )
         }


         project.title = null
         project.discription = null
         project.createdBy = null
         project.members = null
         project.status = null
         project.updatedAt = null
         project.createdAt = null
    
        await project.save()
        
        return res.status(200).json(
                apiResponse(200 ,"project deleted successfully")
            )
})


const GetProjectById = asyncHandeler(async (req, res , next)=>{

    // user se email id lo ki kis id se related project dekhne hai 
    // uss email se user ki id nkalo 
    // uss id ke basis pr project ko dhundho
    // project ke titles and discrition ko display kro
    const {email} = req.body

 try {
       const user = User.findOne({email})
       if(!user){
           return  res.status(400).json(
                   apiError(400 ,"No such user present enter a valid user to search for the project")
               )
       }
       const TotalProject = Project.find({createdBy : user.id})
   
       if(!TotalProject){
           return  res.status(400).json(
                   apiError(400 ,"No project found!!")
               )
       }
   
       return res.status(200).json(
                   apiResponse(200 ,TotalProject , "these are all the project found")
               )
   
 } catch (error) {
    console.log("error occured in the GetProjectById controller")
 }
})


const GetProjectMembers = asyncHandeler(async (req, res ,next)=>{

    // user se project ka title lo 
    // uss title pe project ko find kro 
    // bas uss prject ke members ko ko res mai bhej do 

    const {title} = req.body 

    try {
        const project = Project.findOne({title})
    
             if(!project){
               return res.status(400).json(
                    apiError(400 ,"No such porject found !!! enter a valid project name")
                )
             }
    
            return res.status(200).json(
                apiResponse(200 , project.members , "these are the members of this project")
             )
        
    } catch (error) {
        console.log("error occured in the GetProjectMembers controller")
    }
})



const AddProjectMembers = asyncHandeler(async (req, res ,next)=>{
    
    // user se member ke email lo and project ka title bhi lo
    // uss email se unki id nikalo 
    //project members mai un id ko push krdo

    try {
        const {title , members} = req.body
    
        const project = await Project.findOne({title})
    
             if(!project){
               return res.status(400).json(
                    apiError(400 ,"No such porject found !!! enter a valid project name")
                )
             }
        
        let isNotUser = false
        for(i in members){
            const user = await User.findOne({email : i})
            if(!user){
                isNotUser = true
                break
            }
            else{project.members.push(user.id)}
        }
    
        if(isNotUser){
             return res.status(400).json(
                    apiError(400 ,`this user with the email id ${i} is not there in the db give the correct email id`)
                )
        }
       await project.save()
         return res.status(200).json(
                    apiResponse(200 , "enw members are added succesfully" )
                )
    } catch (error) {
        console.log("error occured in the AddProjectMembers controllers")
    }

})


const DeleteProjectMembers = asyncHandeler(async (req, res ,next)=>{

        //project ka title and jis member ko delete krna hai uski email id lo
        // title se project ko dhundho and email id se user ki id ko 
        // uss id ko project ke members mai dhundho
        // remove krdo 

    const {title , members} = req.body
    
        const project = await Project.findOne({title})
    
             if(!project){
               return res.status(400).json(
                    apiError(400 ,"No such porject found !!! enter a valid project name")
                )
             }

        const userId = []
        const IsNotUser = false
        for( let i =0 ; i < members.length ; i++){
            const user = await User.findOne({email : members[i]})
            if(!user){
                IsNotUser = true
                break
            }
            else{userId.push(user.id)}
        }

        if(IsNotUser){
             return res.status(400).json(
                apiError(400 ,`member u want to delete is not in the db plz enter a valid member`)
            )
        }

        for(let i =0 ;i < userId.length ; i++){
            for(let j =0 ; j < project.members.length  ; j++){
                if(userId[i] == project.members[j]){
                project.members.splice(1,j)
            }
            }
        }

        await project.save()

         return res.status(200).json(
                apiError(200 ,project, "project member deleted")
            )


})


const UpdateProjectMembersRole = asyncHandeler(async (req, res ,next)=>{
    

})


const GetProjectByTitle = asyncHandeler(async (req, res ,next)=>{

    

})