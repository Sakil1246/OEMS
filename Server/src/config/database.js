const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();

const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URL,{
        // to avoid deprecation warnings
        //it is enabled by default  by node 4.0 version . so no need to write
        // useNewUrlParser:true,
        // useUnifiedTopology:true

    });
};


module.exports=connectDB;