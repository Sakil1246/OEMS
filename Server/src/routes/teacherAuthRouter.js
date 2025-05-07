const express=require("express");
const teacherAuthRouter=express.Router();
const teacherAuthController=require("../controllers/teacherAuth.Controller");




teacherAuthRouter.post("/sendEmail", teacherAuthController.sendEmail);
teacherAuthRouter.post("/verifyOTP", teacherAuthController.verifyOTP);
teacherAuthRouter.post("/signup",teacherAuthController.signup);
teacherAuthRouter.post("/login",teacherAuthController.login);
teacherAuthRouter.post("/logout",teacherAuthController.logout);



module.exports=teacherAuthRouter;