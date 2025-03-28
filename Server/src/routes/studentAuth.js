const express=require("express");
const studentAuthRouter=express.Router();
const {validateStudentSignupData}=require("../utils/validation");
const Student=require("../model/student");
const bcrypt=require("bcrypt");
require("dotenv").config();

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

// const mailOptions = {
//   from: "sakilahmed345677@gmail.com",
//   to: "recipient@example.com",
//   subject: "Hello from Nodemailer",
//   text: "This is a test email sent using Nodemailer.",
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Error sending email: ", error);
//   } else {
//     console.log("Email sent: ", info.response);
//   }
// });
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const otpStore = {};
studentAuthRouter.post("/student/sendEmail", async (req, res) => {
  try {
    console.log(req.body)
      const { rollNo } = req.body;
      if (!rollNo) return res.status(400).json({ message: "Roll number is required" });

      const emailhead = rollNo.toLowerCase();
      const email = `${emailhead}@tezu.ac.in`;

      
      const otp = generateOTP();
      otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Store for 5 minutes

      
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

          //console.log("Email sent: ", info.response);
          res.json({ message: "OTP sent successfully" });
      });
  } catch (error) {
      console.error("Error: ", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
});
studentAuthRouter.post("/student/verifyOTP", (req, res) => {
  try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

      const storedOTP = otpStore[email];

      // Check if OTP exists and is still valid
      if (!storedOTP || storedOTP.expiresAt < Date.now()) {
          return res.status(400).json({ message: "OTP expired or invalid" });
      }

      if (storedOTP.otp !== otp) {
          return res.status(400).json({ message: "Incorrect OTP" });
      }

      // OTP is correct, remove from storage
      delete otpStore[email];

      res.json({ message: "OTP verified successfully" });
  } catch (error) {
      console.error("Error verifying OTP: ", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
});
studentAuthRouter.post("/student/signup", async (req, res) => {
  try {
      validateStudentSignupData(req);
      const { password, firstName, lastName, department } = req.body;
      let { rollNo } = req.body;
      rollNo = rollNo.toLowerCase();
      const existingStudent = await Student.findOne({ rollNo });

      if (existingStudent) {
          return res.status(400).json({ error: "Roll number already exists! Please Sign In" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newStudent = new Student({
          rollNo,
          password: hashPassword,
          firstName,
          lastName,
          department
      });

      const laddu = await newStudent.save();
      const token = newStudent.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

      // const emailhead = rollNo.toLowerCase();
      // const mailOptions = {
      //     from: "sakilahmed345677@gmail.com",
      //     to: emailhead + "@tezu.ac.in",
      //     subject: "Hello from Sakil",
      //     text: "Good Morning.",
      // };

      // // Send email first
      // transporter.sendMail(mailOptions, (error, info) => {
      //     if (error) {
      //         console.error("Error sending email: ", error);
      //         return res.status(500).json({ message: "Signup successful, but email failed to send", data: laddu });
      //     }

      //     console.log("Email sent: ", info.response);
      //     res.json({
      //         message: "New student signed up successfully! Email sent.",
      //         data: laddu,
      //     });
      // });

  } catch (err) {
      res.status(400).send("ERROR: " + err.message);
  }
});

studentAuthRouter.post("/student/login", async (req, res) => {
    try {
      let { rollNo, password } = req.body;
      rollNo = rollNo.toLowerCase();
      const student = await Student.findOne({ rollNo: rollNo });
  
      if (!student) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const isPasswordValid = await student.validatePasswords(password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const token = await student.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
      res.json({ message: "Login successfully", data: student });
  
    } catch (err) {
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  });
  


 studentAuthRouter.post("/student/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged out successfully");
 })
module.exports=studentAuthRouter;