const jwt = require('jsonwebtoken');
const Teacher = require('../model/teacher');
const Student= require('../model/student');

const authTeacher=async(req,res,next)=>{
   try{
     const {token}=req.cookies;
    if(!token){
        throw new Error("Token is invalid");
    }
    const decodeMessage=await jwt.verify(token,"teacher@token");
    const {_id}=decodeMessage;
    const teacher=await Teacher.findById(_id);
    if(!teacher){
        throw new Error("User not found");
    }
    req.teacher=teacher;
    next();
}catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
}


const authStudent=async(req,res,next)=>{
    try{
      const {token}=req.cookies;
     if(!token){
         throw new Error("Token is invalid");
     }
     const decodeMessage=await jwt.verify(token,"student@token");
     const {_id}=decodeMessage;
     const student=await Student.findById(_id);
     if(!student){
         throw new Error("User not found");
     }
     req.student=student;
     next();
 }catch(err){
         res.status(400).send("ERROR:"+err.message);
     }
 }


module.exports={
    authTeacher: authTeacher,
    authStudent: authStudent
}