const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();

const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URL,{
        // to avoid deprecation warnings
        useNewUrlParser:true,
        useUnifiedTopology:true

    });
};


module.exports=connectDB;