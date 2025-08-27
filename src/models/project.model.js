import mongoose , {Schema} from "mongoose";
import {AvailableUserStatus , TaskStausEnum} from "../utils/constants.js"

const projectSchema = new Schema({
    title : {
        type :String,
        required : true,
        unique : true,
        trim : true
    },

    discription : {
        type : String,
        required : true
    },

    createdBy: {
        type : Schema.Types.ObjectId,
        ref  : "User",
        required : true 
    },

    status : {
        type : String,
        enum : AvailableUserStatus,
        default : TaskStausEnum.TODO
    },

    members : [{
        type :Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    }]
 } , {timestamps : true})

export const Project = mongoose.model(  "Project" ,projectSchema)

