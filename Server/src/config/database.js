const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://sa2747911:9XHTQC3bfPL11PMN@oems.b5mdi.mongodb.net/");
};


module.exports=connectDB;