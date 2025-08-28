// create notes , get all notes , get note by id 
// notes are inside the project
// when we create a mobile application and send the access token the token is fetched from the auth or heards i postman - format ---key mai Authorization and value mai - Bearer accessToken
// to access the bearer token we can -- req.headers("Authorization")?.replace("Bearer ","") ither you get the access token from the cookies or from the auth in postman
 // jab ham req.params se data leke aate hai then vo data string mai hota hai jo dikkat krta hai so we chnge its type to objectid - mongoose.Types.ObjectId(projectId)

import asyncHandeler from "../utils/async-handeler.js"
import {Notes} from "../models/notes.model.js"
import {Project} from "../models/project.model.js"
import mongoose from "mongoose"

const makeNotes = asyncHandeler(async (req ,res ,next)=>{

    //content lo user se 
    // update in the db 

    const {content , projectId} = req.body

    

    const project = await Project.findOne({projectId})

    if(!project){
        return res.status(400).json(
            apiError(400 ,"project not found try with different project")
        )
    }

    const notes = await Notes.find({
        project : projectId,
        createdBy : req.user._id
    })

    if(!notes){
        return res.status(400).json(
            apiError(400 ,"notes not found")
        )
    }

    const notesCreated = await notes.create({
        project :  mongoose.Types.ObjectId(projectId),
        createdBy :mongoose.Types.ObjectId(req.user._id),
        content  : content
        
    })

    const NotesCreatedBy = await Notes.findById(notes._id).populate("createdBy" , "fullname")

    if(!notesCreated){
        return res.status(400).json(
            apiError(400 ,"error occured while creating a note")
        )
    }


    return res.status(200).json(
            apiError(200 , `notes are created by ${NotesCreatedBy}` , "notes created successfully")
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

