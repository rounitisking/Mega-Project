import mongoose , {Schema} from "mongoose";

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

    status : Boolean
 } , {timestamps : true})

export const project = mongoose.model(  "Project" ,projectSchema)

