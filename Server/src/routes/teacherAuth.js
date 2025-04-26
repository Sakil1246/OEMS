const express=require("express");
const authRouter=express.Router();
const {validateTeacherSignupData}=require("../utils/validation");
const Teacher=require("../model/teacher");
const bcrypt=require("bcrypt");

 authRouter.post("/teacher/signup",async (req,res)=>{
    try{
        validateTeacherSignupData(req);
        const {password,firstName,lastName,email,department}=req.body;
        const existingTeacher=await Teacher.findOne({email
        });
        if(existingTeacher){
            return res.status(400).json({error:"Email already exists! Please Sign In"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        const newTeacher=new Teacher({
            email,
            password:hashPassword,
            firstName,
            lastName,department
        })
       
        await newTeacher.save();
        const token=await newTeacher.getJWT();
        res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        res.json({
            message:"New teacher Signup successfully",
            data:newTeacher});
    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
 })

 authRouter.post("/teacher/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const teacher=await Teacher.findOne({email:email});
        if(!teacher){
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isPasswordValid=await teacher.validatePasswords(password);
        if(!isPasswordValid){
            return res.status(400).json({ error: "Invalid credentials" });
        }
        else{
            const token=await teacher.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
            res.json({ message: "Login successfully", data: teacher });
        }

    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
 })


 authRouter.post("/teacher/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged out successfully");
 })
module.exports=authRouter;