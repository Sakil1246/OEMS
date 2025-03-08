const express=require("express");
const adminRouter=express.Router();
const {validateAdminSignupData}=require("../utils/validation");
const Admin=require("../model/admin");
const bcrypt=require("bcrypt");



 adminRouter.post("/admin/login",async(req,res)=>{
    try{
        const {email,password,}=req.body;
        const admin=await Admin.findOne({email:email});
        
        if(!admin){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid=await admin.validatePasswords(password);
        if(!isPasswordValid){
            throw new Error("Invalid credentials");
        }
        else{
            const token=await admin.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
            res.json({
                message:"Login successfully",
                data:admin
        });
        }

    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
 })
 adminRouter.post("/admin/signup",async (req,res)=>{
    try{
        validateAdminSignupData(req);
        const {password,email,department,firstName}=req.body;
        const hashPassword=await bcrypt.hash(password,10);
        const newAdmin=new Admin({
            email,
            password:hashPassword,
            firstName,
            department
            
        })
        await newAdmin.save();
        res.send("New teacher Signup successfully");
    }catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
 })

 adminRouter.post("/admin/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged out successfully");
 })
module.exports=adminRouter;