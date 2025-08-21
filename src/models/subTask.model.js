// In Mongoose, trim: true is used to automatically remove extra whitespace (spaces, tabs, newlines) from the beginning and end of a string before saving it to the database

import mongoose , {Schema} from "mongoose";
import {AvailableUserStatus , TaskStausEnum} from "../utils/constants"

const subTaskSchema = new Schema({
    task : {
        type : Schema.Types.ObjectId,
        ref : "Task",
        required : true
    },
    project :{
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },

    title : {
        type : String,
        required : true,
        trim : true
    },

    discription : {
        type : String,
        required: true
    },

    status : {
        type : Boolean,
        enum : AvailableUserStatus,
        default : TaskStausEnum.TODO
    },

    iscompleted : {
        type : Boolean,
        default : false
    },

    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
 } , {timestamps : true})

export const subTask = mongoose.model(  "SubTask" ,subTaskSchema)
