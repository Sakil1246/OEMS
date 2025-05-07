const express=require("express");
const authRouter=express.Router();
const {validateTeacherSignupData}=require("../utils/validation");
const Teacher=require("../model/teacher");
const bcrypt=require("bcrypt");



const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const otpStore = {};
const sendEmail= async (req, res) => {
  try {
    //console.log(req.body)
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      
      const otp = generateOTP();
      otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; 

      
      const mailOptions = {
          from: "sakilahmed345677@gmail.com",
          to: email,
          subject: "ExamZen OTP Verification",
          text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`,
      };

      
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Error sending email: ", error);
              return res.status(500).json({ message: "Email failed to send" });
          }

          res.json({ message: "OTP sent successfully" });
      });
  } catch (error) {
      console.error("Error: ", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
};
const verifyOTP= (req, res) => {
  try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

      const storedOTP = otpStore[email];
      if (!storedOTP || storedOTP.expiresAt < Date.now()) {
          return res.status(400).json({ message: "OTP expired or invalid" });
      }

      if (storedOTP.otp !== otp) {
          return res.status(400).json({ message: "Incorrect OTP" });
      }
      delete otpStore[email];

      res.json({ message: "OTP verified successfully" });
  } catch (error) {
      console.error("Error verifying OTP: ", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
};
 const signup=async (req,res)=>{
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
 };
const login=async (req,res)=>{
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
 };

const logout=async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged out successfully");
 }
module.exports={sendEmail,verifyOTP,signup,login,logout};