import asyncHandeler from "../utils/async-handeler.js"
import { ProjectMember } from "../models/projectMember.model.js"
import User from "../models/user.model.js"
import mongoose from "mongoose"
const taskPermission = asyncHandeler(async (roles , req , res , next)=>{

    const {projectId} = req.params
    
    const task = await ProjectMember.find({
        project : mongoose.Types.ObjectId(projectId),
        user : mongoose.Types.ObjectId(req.user._id)
    })

    if(!task){
          return res.status(400).json(
            apiError(400 ,"task not found try with different task ,error occured in note middleware")
        )
    }

    const user = await User.findById(req.user._id)
    if(!user){
        return res.status(400).json(
            apiError(400 ,"could not found user i task middleware")
        )
    }

    for(let i =0 ;i < roles.length ;i++){
    if(user.role != roles[i]){
        return res.status(400).json(
            apiError(400 ,"user requesting for the task cannot access the task , error in task middleware")
        )
    }
  }

  next()


})