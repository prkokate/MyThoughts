const mongoose=require("mongoose")
const {Schema}=mongoose;

let UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },

    username:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    myNotes:[{ type : mongoose.Types.ObjectId, ref: 'Note' }],

    myFav:[{type : mongoose.Types.ObjectId, ref: 'Note'}],
    profile_pic:{
        type:String,
        required:true
    }


})

module.exports=mongoose.model("user",UserSchema);