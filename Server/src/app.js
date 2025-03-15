const express = require("express");
const app = express();
const connectDB = require("./config/database");
const authRouter = require("./routes/teacherAuth");
const studentAuthRouter = require("./routes/studentAuth");
const examRouter = require("./routes/exam");
const cookieParser = require("cookie-parser");
const adminRouter = require("./routes/adminAuth");

const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


app.use("/", authRouter);
app.use("/", studentAuthRouter);
app.use("/", examRouter);
app.use("/", adminRouter);

connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(5000, () => {
      console.log("Server is successfully listening to port 5000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected", err);
  });
