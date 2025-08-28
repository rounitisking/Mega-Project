// yaha pe mujhe ek permission check laga hai jismai mai ye karunga ki mai user se role lunga in the parameter 
//params se project title
// req se user ka role
//next()

import asyncHandeler from "../utils/async-handeler.js"
import { ProjectMember } from "../models/projectMember.model.js"
import User from "../models/user.model.js"
import mongoose from "mongoose"
const NotesPermissions = asyncHandeler(async (roles , req , res , next)=>{

    const {projectId} = req.params
    
    const notes = await ProjectMember.find({
        project : mongoose.Types.ObjectId(projectId),
        user : mongoose.Types.ObjectId(req.user._id)
    })

    if(!notes){
          return res.status(400).json(
            apiError(400 ,"notes not found try with different notes ,error occured in note middleware")
        )
    }

    const user = await User.findById(req.user._id)
    if(!user){
        return res.status(400).json(
            apiError(400 ,"could not found user i notes middleware")
        )
    }

    for(let i =0 ;i < roles.length ;i++){
    if(user.role != roles[i]){
        return res.status(400).json(
            apiError(400 ,"user requesting for the notes cannot access the notes , error in notes middleware")
        )
    }
  }

  next()


})