const express=require("express")
const router=express.Router();
const jwt=require("jsonwebtoken")
require("dotenv").config();
JWT_SECRET=process.env.JWT_SECRET
const bcrypt=require("bcryptjs")
let User = require('../models/User');
let Note=require("../models/Note")
const fetchuser=require("../middleware/fetchuser");

let success=false;


router.get("/all-notes",async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    try{
        const noteArr=await Note.find();
        //console.log(noteArr)
        noteArr.sort((a,b)=>{
            let da = new Date(a.date),
                db = new Date(b.date);
            return db - da;
        });
        res.json(noteArr)
    }
    catch(err){
        console.log(err)
        res.status(500).send("bad request");
    }
})

router.get("/my-favorites",fetchuser,async(req,res)=>{
    try{
    let curuser=await User.findById(req.user.id)
    let noteFav=curuser.myFav;
    let noteArr=[]
    for(i=0;i<noteFav.length;i++){
        var item= await Note.findById(noteFav[i])
        noteArr.push(item);
    }
    res.json(noteArr);
}catch(err){
    console.log(err)
    res.status(500).send("Baddest request!")
}
})


router.get("/getFavList",fetchuser,async(req,res)=>{
    try{
        const curuser=await User.findById(req.user.id);
        //console.log(req.user);
        var arr=[];
        if(curuser.myFav){
             arr=curuser.myFav
        }
        

        res.json(arr);
        
    }
    catch(err){
        console.log(err);
        return  res.status(400).send("Bad Request!");
    }
})

router.put("/add-favorite/:id",fetchuser,async(req,res)=>{
    try{
        let curuser=await User.findById(req.user.id)
    //console.log(req.params.id);
    if(!curuser.myFav || !curuser.myFav.includes(req.params.id)){
        await User.findByIdAndUpdate(req.user.id,{"myFav":[...curuser.myFav,req.params.id]})
        success=true;
        res.json(success);
    }
    else{
        success=false;
        res.json(success)
    }}
    catch(err){
        console.log("ERROR-Ahe-re:",err);
        success=false
        res.status(400).json(success)
    }
})


router.put("/remove-favorite/:id",fetchuser,async(req,res)=>{
    try{
        let curuser=await User.findById(req.user.id)
    //console.log(req.params.id);
    if(curuser.myFav && curuser.myFav.includes(req.params.id)){
        const ind=curuser.myFav.indexOf(req.params.id);
        if(ind>-1){
            curuser.myFav.splice(ind,1);
        }
        await User.findByIdAndUpdate(req.user.id,{$set:{"myFav":curuser.myFav}})
        success=true;
        res.json(success);
    }
    else{
        success=false;
        res.json(success)
    }}
    catch(err){
        console.log("ERROR-Ahe-re:",err);
        success=false
        res.status(400).json(success)
    }
})


router.post("/add-note",fetchuser,async(req,res)=>{
    const {title,description,image}=req.body;
   try{

    let curuser=await User.findById(req.user.id);
    console.log(req.user);

   
    const addNote=await Note.create({
        author:req.user.username,
        title:title,
        description:description,
        profile_pic:req.user.profile_pic,
        image:image?image:"https://media.istockphoto.com/id/1363398400/photo/woman-traveler-in-europa-alhambra-in-spain.jpg?s=612x612&w=0&k=20&c=Z14eQ_IJywp7COkEQvAhxhiOagmqupQaO_RuRg5kEzM="
    })


    await User.findByIdAndUpdate(req.user.id,{"myNotes":[...curuser.myNotes,addNote._id]});

    res.json(addNote)


}catch(err){
    console.log(err);
    return res.status(400).json({error:"Internal server error!"});
}
})











module.exports=router