const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const Exam=require("./exam");
const adminSchema=mongoose.Schema({
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
    }
},{timestamps: true});
 
adminSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"admin@token",{expiresIn:"1d"});
    return token;
}

adminSchema.methods.validatePasswords=async function(userInputPassword){
    const user=this;
    const hashPaasword=user.password;
    const isPassword=await bcrypt.compare(userInputPassword,hashPaasword);
    return isPassword;
}
module.exports=mongoose.model("Admin",adminSchema);