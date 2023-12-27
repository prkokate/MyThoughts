require("dotenv").config()
const JWT_SECRET=process.env.JWT_SECRET
const jwt =require('jsonwebtoken')


const fetchuser=(req,res,next)=>{
    const token=req.header("auth-token")
    //console.log("token=",token)
    if(!token){
        res.status(400).send("Authentication failed! token is null")
    }

    try{
        const decoded= jwt.verify(token,JWT_SECRET);
        req.user=decoded.user;
       // console.log(decoded)
        next()

    }
    catch(err){
        res.status(400).send({error:"Invalid Token!"})
    }
}

module.exports=fetchuser