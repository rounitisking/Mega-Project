// controllers to make are - 1. get porject - means get all the project 2. get porjetc by id - means get single project    6. addmember to project  7.gte porject memebers   9. update project member role 10. delete member


import {Project}  from "../models/project.model.js"
import User from "../models/user.model.js"
import asyncHandeler from "../utils/async-handeler.js"
import  apiResponse from "../utils/api-response.js"
import {apiError} from "../utils/api.error.js"
import dotenv from "dotenv"
import {sendMail , EmailOption } from "../utils/mail.js"
import jwt from "jsonwebtoken"
import {userRolesEnum} from "../utils/constants.js"
import { useReducer } from "react"
dotenv.config()

const MakeProject = asyncHandeler(async (req , res  , next)=>{

        // tile , discription , status  , created by , members -- user se lo 
        //validation vaha ho jayega 
        // in sab deta ko store kr vao db mai 
        
        // yaha pr admin ka and members ka email ayega
        const {title  , discription , createdBy , status , members} = req.body
        
        const projectAdmin = await User.findOne({email : createdBy})
        
        if(!projectAdmin){
           return  res.status(400).json(
                apiError(400 , "The projectAdmin user does not exsist plz change the projectAdmin")
            )
        }

        // mai yeh check kr raha hu ki jis bande ne req kri and jo email id admin ke liye diya hai kya vo user same hai ya nhi 
        if(req.user.id != projectAdmin.id){
            return res.status(400).json(
                apiError(400 , "The person requested to make project and and the project admindetails does not match check again")
            )
        }
         Project.createdBy = req.user.id
        
         Project.members.push(req.user.id)
        const isNoProjectMember = false
        for(let i =0 ; i < members.length ; i++){
            const ProjectMembers = User.findOne({email : members[i]})
            if(!ProjectMembers){
              isNoProjectMember = true
                break
            }
        else{
            Project.members.push(ProjectMembers.id)
        }
        
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

         const {title  , discription , createdBy , status , ChangeAdmin} = req.body

         // ham yaha ye validate kr rahe hai ki jis bande ne req kri hai and jo email provided hai kya vo same hai 
        const projectAdmin = await User.findOne({email : createdBy})
        
        if(!projectAdmin){
           return  res.status(400).json(
                apiError(400 , "The projectAdmin user does not exsist plz change the projectAdmin")
            )
        }

        // mai yeh check kr raha hu ki jis bande ne req kri and jo email id admin ke liye diya hai kya vo user same hai ya nhi 
        if(req.user.id != projectAdmin.id){
            return res.status(400).json(
                apiError(400 , "The person requested to make project and and the project admindetails does not match check again")
            )
        }


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

         if(ChangeAdmin != null){
                const ProjectAdmin = User.findOne({email : ChangeAdmin})

                if(!ProjectAdmin){
                     res.status(400).json(
                apiError(400 ,"enter a valid email")
            )
                }

                project.createdBy = projectAdmin.id
                project.members = projectAdmin.id

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

    const {title , adminEmail} = req.body



    
    // checkkig if the requesting person and the email provided are the same
    const checkAdmin = User.findOne({email : adminEmail})
    
    if(req.user.id != checkAdmin.id){
        return res.status(400).json(
            apiError(400 ,"the user requesting to delete the project is a admin")
        )
    }
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

    const {title ,checkAdmin} = req.body 

    try {
        //checking if the req user and the email of the admin are same
        const user = User.findOne({email : checkAdmin})
            if(req.user.id != user.id ){
        return res.status(400).json(
            apiError(400 ,"the user requesting to delete the project is a admin")
        )
    }


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
        const {title , members , checkAdmin} = req.body
        
        const project = await Project.findOne({title})

        //validate whether the requested person and email are same
           const user = User.findOne({email : checkAdmin})
            if(req.user.id != user.id ){
        return res.status(400).json(
            apiError(400 ,"the user requesting to delete the project is a admin")
        )
    }

        //then ye check krna hia ki kya vo already ek member hai ya nhi 
        isAlreadyMember = false
        AlreadyMember = null
        for(let i =0 ; i < members.length ; i++){
            for(let j =0 ;j < project.members.length ; i++){
                if(members[i] == project.members[j]){
                    isAlreadyMember = true
                    AlreadyMember = members[i]
                    break
                }
            }
            if(isAlreadyMember){
                break;
            }
        }

        if(isAlreadyMember){
            return res.status(400).json(
                new apiError(400 , `the member u want to add is already a member which is ${AlreadyMember}`)
            )
        }

    
    
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




    const {title , members , checkAdmin} = req.body


        //validate whether the requested person and email are same
           const user = User.findOne({email : checkAdmin})
            if(req.user.id != user.id ){
        return res.status(400).json(
            apiError(400 ,"the user requesting to delete the project is a admin")
        )
    }
    
        const project = await Project.findOne({title})
    
             if(!project){
               return res.status(400).json(
                    apiError(400 ,"No such porject found !!! enter a valid project name")
                )
             }

        

        for(let i =0 ;i < members.length ; i++){
            for(let j =0 ; j < project.members.length  ; j++){
                if(members[i] == project.members[j]){
                project.members.splice(1,j)
            }
            }
        }

        await project.save()

         return res.status(200).json(
                apiError(200 ,project.members, "project member deleted")
            )


})


const UpdateProjectMembersRole = asyncHandeler(async (req, res ,next)=>{
    
            // pehle tho valid the requested user
            //project ko find kro by the help of title
            // teen arary loon the basisi of member , admin , project admin 
            // usk ebaad ye dekho ki ya vo members existing project mai hai ya nhi hai 
            // agar agar null hai tho leave if array mai kuch hai then uss email se user ko find kro and change the email

           const {title , member , admin , projectAdmin , checkAdmin} = req.body

           

        //validate whether the requested person and email are same
           const user = await User.findOne({email : checkAdmin})
            if(req.user.id != user.id ){
        return res.status(400).json(
            apiError(400 ,"the user requesting to delete the project is a admin")
        )
        }


        const project = await Project.findOne({title})

        if(!project){
            return res.status(400).json(
                new apiError(400 , "project not found")
            )
        }

        if(member != []){
            for(let i =0 ; i < member.length ; i++){
                
                await User.findByIdAndUpdate(project.members.id , {role : userRolesEnum.MEMBER})

            }
        }
        if(admin != []){
            for(let i =0 ; i < member.length ; i++){
                
                await User.findByIdAndUpdate(project.members.id , {role : userRolesEnum.MEMBER})

            }
        }
        if(projectAdmin != []){
            for(let i =0 ; i < member.length ; i++){
                
                await User.findByIdAndUpdate(project.members.id , {role : userRolesEnum.MEMBER})

            }
        }

        return res.status(200).json(
                new apiResponse(200 , "user role changed successfully")
            )


})


const GetProjectByTitle = asyncHandeler(async (req, res ,next)=>{

    // user se prpoject ka title lo 
    // search the project
    // project ko res mai bhej do 

    try {
        const {title , checkAdmin} = req.body

        //validate whether the requested person and email are same
           const user = User.findOne({email : checkAdmin})
            if(req.user.id != user.id ){
        return res.status(400).json(
            apiError(400 ,"the user requesting to delete the project is a admin")
        )
    }
    
            const project = await Project.findOne({title})
        
                 if(!project){
                   return res.status(400).json(
                        apiError(400 ,"No such porject found !!! enter a valid project name")
                    )
                 }
            
            return res.status(200).json(
                        apiResponse(200 ,project , "these are the details of the project")
                    )
    
    } catch (error) {
        console.log("error occured in the getprojectbytitle controller")
    }
})