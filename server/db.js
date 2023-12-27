require("dotenv").config()
const mongoose=require("mongoose")
const MongoURI=process.env.MongoURI

const MongoConnect=()=>{
    mongoose.connect(MongoURI).then(()=>{
        console.log("Connected to mongodb!");
    }).catch((err)=>{
        console.log(`Error connecting to MongoDB: ${err}`);
    })
}

module.exports=MongoConnect