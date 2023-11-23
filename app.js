const express=require("express")
const app=express()
const mongoose= require("mongoose")
app.use(express.json())
const cors= require("cors")
app.use(cors())
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const JWT_SECRET="sdfsdjfnjsnfjnajnsfdf27617892409988y4232aksljdhgjasdaddmam"



const mongoUrl="mongodb+srv://gobikannan:mongo@cluster0.5ya8vdc.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
}).then(()=>{console.log("Connected to database")})
.catch(e=>console.log(e))

require("./userDetails")

const User=mongoose.model("UserInfo")

app.post("/register", async(req,res)=>{
    const {username,email,password,cpassword}=req.body
    const encryptedPassword=await bcrypt.hash(password,10)
    try{
        const oldUser= await User.findOne({email});
        if(oldUser){
           return res.send({error:"User Exists"})
        }
        await User.create({
            username,
            email,
            password:encryptedPassword,
            cpassword,
        });
        res.send({status:"ok"})

    }catch(error){
res.send({status:"error"})
    }
})

app.post("/login-user", async(req,res)=>{
    const {email,password}=req.body
    const user= await User.findOne({email});
    if(!user){
        return res.json({error:"User Not Found"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token=jwt.sign({email:user.email}, JWT_SECRET)
        if( res.status(201)){
            return res.json({status:"ok",data:token})
        } else{
            return res.json({error:"error"})
        }
    }
    res.json({status:"error",error:"Invalid Password"})
})


app.post("/userData",async(req,res)=>{
    const {token}=req.body;
    try{
        const user=jwt.verify(token,JWT_SECRET)
        console.log(user)

        const usermail=user.email
        User.findOne({email:usermail})
        .then((data)=>{
            res.send({status:"ok",data:data});
        }).catch((error)=>{
            res.send({status:"error",data:error})
        })
    }catch(error){

    }
})

app.post("/update-user",async(req,res)=>{
    const{id,username,email,gender,age,dob,mobile}=req.body
    try{
        await User.updateOne({_id:id},{
            $set: {
                username:username,
                email:email,
                gender:gender,
                age:age,
                dob:dob,
                mobile:mobile
            }
        })
        return res.json({status:"ok",data:"updated"})
    }catch(error){
        return res.json({status:"error",data:error})
    }
})

app.listen(5000,()=>{
    console.log("server started")
})



