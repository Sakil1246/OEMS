const  validator=require("validator");
const student = require("../model/student");
const validateTeacherSignupData=(req)=>{
    const {email,password,firstName,lastName}=req.body;
    const isEmailValid=validator.isEmail(email);
    const isPasswordValid=validator.isStrongPassword(password);
    if(!isPasswordValid){
        return {error:"Password is not strong enough"};
    }
    if(!isEmailValid){
        return {error:"Invalid email"};
    }
    if(!firstName || !lastName){
        return {error:"First name and last name are required"};
    }
    if(!firstName.lenghth>50 && ! firstName.length<2){
        return {error:"First name should be between 2 and 50 characters"};
    }
    

}


const validateStudentSignupData=(req)=>{
    const {rollNo,password,firstName,lastName}=req.body;
    
    
    const isPasswordValid=validator.isStrongPassword(password);
    
    if(!isPasswordValid){
        return {error:"Password is not strong enough"};
    }
    
    if(!firstName  ){
        return {error:"First Name is required"};
    }
    if(!firstName.lenghth>50 && ! firstName.length<2){
        return {error:" First Name should be between 2 and 50 characters"};
    }
    if(!lastName.lenghth>50 && ! lastName.length<2){
        return {error:" Last Name should be between 2 and 50 characters"};
    }
    

}
const validateAdminSignupData=(req)=>{
    const {email,password}=req.body;
    
    const isPasswordValid=validator.isStrongPassword(password);
    const isEmailValid=validator.isEmail(email);
    if(!isPasswordValid){
        return {error:"Password is not strong enough"};
    }
    if(!isEmailValid){
        return {error:"Invalid email"};
    }
    

}


module.exports={
    validateTeacherSignupData,
    validateStudentSignupData,
    validateAdminSignupData

};