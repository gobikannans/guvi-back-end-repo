const mongoose=require("mongoose")
const UserDetailSchema=new mongoose.Schema(
    {
        username:String,
        email:String,
        password:{type:String, unique:true},
        cpassword:String,
        gender:String,
        age:String,
        dob:String,
        mobile:String

    },{
        collection:"UserInfo"
    }
);

mongoose.model("UserInfo",UserDetailSchema)