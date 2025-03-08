const express = require("express");
const { authTeacher, authStudent } = require("../middlewares/auth");
const Exam = require("../model/exam");
const Question = require("../model/question");
const Answer = require("../model/answer");
//const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const examRouter = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




const multer = require("multer");
const storage = multer.memoryStorage(); // Using memory storage for cloud uploads
const upload = multer({ storage });

examRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "exam_images" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(req.file.buffer);
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});



examRouter.post("/teacher/exam/create", authTeacher, async (req, res) => {
  try {
    let { semester, examName, startTime, duration, questions, subjectName, totalMarks, passingMarks, aboutExam,department } = req.body;

    // Convert questions to an array if it is a string (fix frontend issues)
    if (typeof questions === "string") {
      questions = JSON.parse(questions);
    }

    // Convert numeric fields properly
    semester = Number(semester);
    duration = Number(duration);
    totalMarks = Number(totalMarks);
    passingMarks = passingMarks ? Number(passingMarks) : undefined;

    // Fix: Change `aboutExam` to `about` to match schema
    const about = aboutExam;

    // Validate required fields before proceeding
    if (!semester || !examName || !startTime || !duration || !subjectName || !totalMarks || !department) {
      return res.status(400).json({ error: "Missing required fields. Please provide all necessary details." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "At least one question must be provided." });
    }

    // Add teacher ID to each question
    const questionsWithTeacher = questions.map(q => ({ ...q, createdBy: req.teacher._id }));

    // Save questions to the database
    const savedQuestions = await Question.insertMany(questionsWithTeacher);

    // Create new exam
    const newExam = new Exam({
      teacherId: req.teacher._id,
      semester,
      examName,
      startTime,
      duration,
      subjectName,
      totalMarks,
      passingMarks,
      department,
      about, // Updated field name
      questions: savedQuestions.map(q => q._id),
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", examId: newExam._id });

  } catch (err) {
    console.error("Error creating exam:", err);

    // Improved Error Handling for Mongoose Validation Errors
    if (err.name === "ValidationError") {
      let messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(400).json({ error: err.message });
  }
});


//API for getting all exam list that are available for upcoming daes

examRouter.get("/student/exam/list", authStudent, async (req, res) => {
  try{

    const exams = await Exam.find({  })  
    .select("semester examName subjectName startTime duration totalMarks department _id teacherId")  
    .sort({ startTime: 1 });

  
  const examsList = exams.map(exam => {
    const now=new Date();
    const startTime=new Date(exam.startTime);
    const endTime=new Date(exam.startTime + exam.duration*60000);
    return{
  semester: exam.semester,
    examName: exam.examName,
    subjectName: exam.subjectName,
    examDate: exam.startTime,
    duration: exam.duration,
    department: exam.department,
    totalMarks: exam.totalMarks,
    endTime: endTime,
    examId: exam._id,
    teacherId: exam.teacherId,
  };
  });

  
  res.json(examsList);
  }catch(err){
      res.status(400).send("ERROR :"+err.message);
  }
});

examRouter.get("/student/exam/:examId/questions", authStudent, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate("questions");
    if (!exam) return res.status(404).json({ message: "Exam not found." });

    res.status(200).json({ questions: exam.questions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", error: err.message });
  }
});


examRouter.post("/student/exam/submit", authStudent, async (req, res) => {
  try {
    const { examId, answers } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ message: "Invalid answers format." });

    const answerDocs = answers.map(ans => ({
      examId, questionId: ans.questionId, studentId: req.student._id,
      answerText: ans.answerText || null, selectedOption: ans.selectedOption || null
    }));

    await Answer.insertMany(answerDocs);
    res.status(200).json({ message: "Answers submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
});


examRouter.post("/teacher/evaluate", authTeacher, async (req, res) => {
  try {
    const { answerId, marksObtained } = req.body;
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found." });

    answer.marksObtained = marksObtained;
    answer.evaluated = true;
    await answer.save();

    res.status(200).json({ message: "Answer evaluated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Evaluation failed", error: err.message });
  }
});

module.exports = examRouter;
