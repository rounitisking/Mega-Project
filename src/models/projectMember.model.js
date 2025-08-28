import mongoose , {Schema, SchemaType} from "mongoose";

import {AvailableUserRoles , userRolesEnum} from "../utils/constants.js"

const projectMemberSchema = new Schema({
    
    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },

    role : {
        type :  String,
        enum: AvailableUserRoles,
        default : userRolesEnum.MEMBER
    },

    user  : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }

},{timestamps : true})

export const ProjectMember = mongoose.model(  "ProjectMember" ,projectMemberSchema)

