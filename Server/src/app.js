const express = require("express");
const app = express();
const connectDB = require("./config/database");
const teacherAuthRouter = require("./routes/teacherAuthRouter");
const studentAuthRouter = require("./routes/studentAuthRouter");
const examRouter = require("./routes/examRouter");
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

app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/teacher", teacherAuthRouter);
app.use("/student", studentAuthRouter);
app.use("/", examRouter);
app.use("/admin", adminRouter);

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
