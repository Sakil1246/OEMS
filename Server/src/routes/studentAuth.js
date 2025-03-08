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

      const emailhead = rollNo.toLowerCase();
      const mailOptions = {
          from: "sakilahmed345677@gmail.com",
          to: emailhead + "@tezu.ac.in",
          subject: "Hello from Sakil",
          text: "Good Morning.",
      };

      // Send email first
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Error sending email: ", error);
              return res.status(500).json({ message: "Signup successful, but email failed to send", data: laddu });
          }

          console.log("Email sent: ", info.response);
          res.json({
              message: "New student signed up successfully! Email sent.",
              data: laddu,
          });
      });

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