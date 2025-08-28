// create ,get , update , delete 

import asyncHandeler from "../utils/async-handeler.js"
import {Task} from "../models/task.model.js"
import {Project} from "../models/project.model.js"
import mongoose from "mongoose"
import User from "../models/user.model.js"

const makeTask = asyncHandeler(async (req ,res ,next)=>{


    const {projectId} = req.params
    const {title , discription , status , assignedTo, assignedBy } = req.body //assigned to and assigned by is an array

    // ye bhi check krna hai ki jo status bheja hai vo enum mai hai ya nhi
    
    const project = await Project.findOne({projectId})

    if(!project){
        return res.status(400).json(
            apiError(400 ,"project not found try with different project")
        )
    }

    const tasks = await Task.find({
        project : projectId,
        assignedBy : req.user._id
    })

    if(!tasks){
        return res.status(400).json(
            apiError(400 ,"notes not found")
        )
    }
    
    
    //ismai ye bhi check krna hai ki jisko assign kiya hai and jisne kia hai vo dono project ke members hai 
    for(let i =0 ; i < assignedTo.length ; i++){
            const user = User.findOne({email : assignedTo[i]})
            
    }


    const Taskcreated = await notes.create({
        project :  mongoose.Types.ObjectId(projectId),
        createdBy :mongoose.Types.ObjectId(req.user._id),
        content  : content
        
    })

    const TaskcreatedBy = await Notes.findById(notes._id).populate("createdBy" , "fullname")

    if(!Taskcreated){
        return res.status(400).json(
            apiError(400 ,"error occured while creating a note")
        )
    }


    return res.status(200).json(
            apiError(200 , `notes are created by ${TaskcreatedBy}` , "notes created successfully")
        )

 })



const getAllNotes = asyncHandeler(async (req , res , next)=>{


    const {projectId} = req.body

    const project = await Project.findOne({projectId})

    if(!project){
        return res.status(400).json(
            apiError(400 ,"project not found try with different project")
        )
    }

    const notes = Notes.find({
        project : projectId,
        createdBy : req.user._id
    }).populate("createdBy" , "username fullname avatar").populate("project" , "title discription")

    if(!notes){
        return res.status(400).json(
            apiError(400 ,"notes not found")
        )
    }

    return res.status(200).json(
            apiError(200 , notes , "notes detailes sent succefully")
        )

})

const getNotesById = asyncHandeler(async (req , res , next)=>{

    const {projectId} = req.params

})

const updateNotes = asyncHandeler(async (req , res , next)=>{
    
    const {content } = req.body
    const { noteId} = req.params


        const notes = await Notes.findOne({noteId})


    if(!notes){
        return res.status(400).json(
            apiError(400 ,"notes not found")
        )
    }

    const notesUpdated = await Notes.findByIdAndUpdate(notes._id , {content}
         ,{new : true}).populate("createdBy" , "username fullname")                     //yaha pr new: true ka matlab hai, jo nayi value update kri hai usko return krdo


    if(!notesUpdated){
        return res.status(400).json(
            apiError(400 ,"error occured while creating a note")
        )
    }


    return res.status(200).json(
            apiError(200 , notesUpdated  ,"notes updated successfully")
        )



})
const deleteNotes = asyncHandeler(async (req , res , next)=>{
        const {noteId} = req.params

        const note = await Notes.findOne({noteId})
    

    if(!note){
        return res.status(400).json(
            apiError(400 ,"notes not found")
        )
    }

    const notesDeleted = await Notes.findByIdAndDelete(noteId) // Mongoose me us document ko return karta hai jo delete hua hai, aur agar nahi mila to null return karta hai.

    if(!notesDeleted){
        return res.status(400).json(
            apiError(400 ,"error occured while creating a note")
        )
    }


    return res.status(200).json(
            apiError(200 ,"notes deleted successfully")
        )

})

