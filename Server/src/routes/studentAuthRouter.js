const studentAuthController=require("../controllers/studentAuth.Controller");
const express=require("express");
const studentAuthRouter=express.Router();

studentAuthRouter.post("/sendEmail", studentAuthController.sendEmail);
studentAuthRouter.post("/verifyOTP", studentAuthController.verifyOTP);
studentAuthRouter.post("/signup", studentAuthController.signup);
studentAuthRouter.post("/login", studentAuthController.login);
studentAuthRouter.post("/logout", studentAuthController.logout);

  
module.exports=studentAuthRouter;