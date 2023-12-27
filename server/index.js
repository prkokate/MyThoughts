const express=require("express")
const app=express();

const cors=require("cors")
app.use(express.json())

app.use(cors({
  origin:["http://localhost:3000"],
  methods:["POST","GET","PUT"],
  credentials:true
}));

const MongoConnect=require("./db")
MongoConnect();

const port=8000
app.get("/",(req,res)=>{
  res.json("hello")
})



app.use("/api/auth/",require("./routes/auth"));
app.use("/api/notes/",require("./routes/notes"));

app.listen(port,()=>{
  console.log("Server started at port",port);
})