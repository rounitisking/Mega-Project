// we never save photos or videos on databases it gets filled easily -- we put the image and the video in the file service and from there we get the url and then we use the url to host the image

import mongoose , {Schema} from "mongoose";
import {AvailableUserStatus , TaskStausEnum} from "../utils/constants"

const taskSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    discription : {
        type : String,
        required : true
    },

     status : {
        type : Boolean,
        enum : AvailableUserStatus,
        default : TaskStausEnum.TODO
    },

    project : {
        type: Schema.Types.ObjectId,
        ref : "Project",
        required : [true , "project reference is required "] // this is used to send the custome messages 
    },
    
    //attachmets ke data fields depends he data provided by the file service 
    attachments : {
        type : [{
            url : String,
            mimetype : String,
            size : Number
        }],
        default : []
    },

    assignedTo :{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    assignedBy :{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
 } , {timestamps : true})

export const task = mongoose.model(  "Task" ,taskSchema)
