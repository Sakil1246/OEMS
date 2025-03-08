const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const Exam=require("./exam");


const teacherSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address');
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    // examcreated:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Exam'
    // }
},{timestamp:true});
 
teacherSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"teacher@token",{expiresIn:"1d"});
    return token;
}

teacherSchema.methods.validatePasswords=async function(userInputPassword){
    const user=this;
    const hashPaasword=user.password;
    const isPassword=await bcrypt.compare(userInputPassword,hashPaasword);
    return isPassword;
}
module.exports=mongoose.model("Teacher",teacherSchema);