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
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://51.20.5.66",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json()); // to convert json to js object that comes from req.body
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRouter);
app.use("/", studentAuthRouter);
app.use("/", examRouter);
app.use("/", adminRouter);

const PORT = process.env.PORT ;

connectDB()
  .then(() => {
    console.log("Database is connected");

    
    const server = app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}`);
    });

    
    process.on("SIGINT", () => {
      console.log("Gracefully shutting down the server...");
      server.close(() => {
        console.log("Closed all connections");
        process.exit(0); 
      });
    });
  })
  .catch((err) => {
    console.log("Database is not connected", err);
    process.exit(1); 
  });
