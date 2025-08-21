import mongoose , {Schema, SchemaType} from "mongoose";

const notesSchema = new Schema({
    project : {
        type : Schema.Types.ObjectId,
        ref  : "Project",
        required : true
    },

    createdBy : {
        type : Schema.Types.ObjectId,
        ref :"User",
        required : true
    },

    content : {
        type : String,
        required : true
    }
}, {timestamps : true})

export const notes = mongoose.model(  "Notes" ,notesSchema)

