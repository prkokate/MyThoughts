const mongoose=require("mongoose")
const {Schema}=mongoose;

let NoteSchema=new Schema({

    author:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    profile_pic:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1363398400/photo/woman-traveler-in-europa-alhambra-in-spain.jpg?s=612x612&w=0&k=20&c=Z14eQ_IJywp7COkEQvAhxhiOagmqupQaO_RuRg5kEzM="
    },

    date:{
        type:Date,
        default:new Date()
    }
    
})


module.exports=mongoose.model("note",NoteSchema);