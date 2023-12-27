const express=require("express")
const router=express.Router();
const jwt=require("jsonwebtoken")
require("dotenv").config();
JWT_SECRET=process.env.JWT_SECRET
const bcrypt=require("bcryptjs")
let User = require('../models/User');
const fetchuser=require("../middleware/fetchuser")

let success=false;

router.post("/sign-up",async(req,res)=>{
   
    try{
        let userExists=await User.findOne({name:req.body.name, username:req.body.username});
        if(userExists){
            success=false;
            return res.status(500).json({success,error:"User already exists"});
        }

        const salt= await bcrypt.genSalt(10)
        const newPassword=await bcrypt.hash(req.body.password,salt);
        // newPassword=newPassword.toString()

        let newUser= await User.create({
            name : req.body.name ,
            username : req.body.username ,
            password :newPassword ,
            myNotes:[],
            myFav:[],
            profile_pic:"https://robohash.org/mollitiaveritatissimilique.png?size=50x50&set=set1"
        })

        const data={
            user:{
                id:newUser.id,
                username:newUser.username,
                profile_pic:newUser.profile_pic
            }
        }
        console.log(data.user);


        const jwtToken=jwt.sign(data,JWT_SECRET);
        success=true;

        res.json({success, "status":"User created successfully", Token:jwtToken})
    }
    catch(err){

        console.log(`Error in creating the new user ${err}`);
        success=false;
        res.status(500).send(success,"Some error occurred!");
    }
})


router.post("/login",async(req,res)=>{
        try{
            let userExists=await User.findOne({name:req.body.name,username:req.body.username})
            if(!userExists){
                success=false;
                return res.status(500).json({success,error:"User does not exist!"})
            }

            const Passmatch= await bcrypt.compare(req.body.password,userExists.password)
            if(!Passmatch){
                success=false;
                return res.status(400).json({success,error:"Invalid credentials!"})
            }

            const data={
                user:{
                    id:userExists.id,
                    username:userExists.username,
                    profile_pic:userExists.profile_pic
                }
            }

            const jwtToken=jwt.sign(data,JWT_SECRET);
            success= true
            res.json({success,Token:jwtToken})
        }
        catch(err){
            console.log("Login Error ", err);
            res.status(400).json({success: false, error:'Wrong Credentials'});
        }
})


module.exports=router