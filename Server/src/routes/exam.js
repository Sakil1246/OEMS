

const { authTeacher, authStudent } = require("../middlewares/auth");
const express = require("express");
const Exam = require("../model/exam");
const Question = require("../model/question");
const Answer = require("../model/answer");
//const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const moment = require("moment-timezone");
require("dotenv").config();

const examRouter = express.Router();
const { parse, format }= require ("date-fns");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




const multer = require("multer");
const exam = require("../model/exam");
const storage = multer.memoryStorage(); 
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
    let { semester, examName, startTime, duration, questions, subjectName, totalMarks, passingMarks, aboutExam, department } = req.body;

   
    if (typeof questions === "string") {
      questions = JSON.parse(questions);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "At least one question must be provided." });
    }

    
    const questionsWithTeacher = questions.map(q => ({
      ...q,
      createdBy: req.teacher._id,  
    }));

   
    const savedQuestions = await Question.insertMany(questionsWithTeacher);
    const questionIds = savedQuestions.map(q => q._id); 
    

    
    const newExam = new Exam({
      teacherId: req.teacher._id,
      semester: Number(semester),
      examName,
      startTime,
      duration: Number(duration),
      subjectName,
      totalMarks: Number(totalMarks),
      passingMarks: passingMarks ? Number(passingMarks) : undefined,
      department,
      about: aboutExam,
      questions: questionIds,  
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", examId: newExam._id });

  } catch (err) {
    console.error("Error creating exam:", err);
    res.status(400).json({ error: err.message });
  }
});







examRouter.get("/student/exam/list", authStudent, async (req, res) => {
  try {
    const exams = await Exam.find({})
      .select("semester examName subjectName startTime duration totalMarks department _id teacherId")
      .sort({ startTime: 1 });

    const examsList = exams.map((exam) => {
      const now = new Date();

      // Parse startTime correctly if stored in "dd/MM/yyyy, hh:mm a" format
      let startTime = new Date(exam.startTime);
      if (typeof exam.startTime === "string") {
        startTime = parse(exam.startTime, "dd/MM/yyyy, hh:mm a", new Date());
      }

      const endTime = new Date(startTime.getTime() + exam.duration * 60000);

      // Convert to required format
      const startTimeIST = format(startTime, "dd/MM/yyyy, hh:mm a");
      const endTimeIST = format(endTime, "dd/MM/yyyy, hh:mm a");

      return {
        semester: exam.semester,
        examName: exam.examName,
        subjectName: exam.subjectName,
        examDate: startTimeIST,
        duration: exam.duration,
        department: exam.department,
        totalMarks: exam.totalMarks,
        endTime: endTimeIST,
        examId: exam._id,
        teacherId: exam.teacherId,
      };
    });

    res.json(examsList);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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


examRouter.post("/student/exam/submit/:examId", authStudent, async (req, res) => {
  try {
    const { examId } = req.params; 
    const answers = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid answers format." });
    }

    const answerDocs = answers.map((ans) => ({
      examId: examId,  
      questionId: ans.questionId,
      studentId: req.student._id,
      answerText: ans.answerText || null,
      selectedOption: ans.selectedOption || null,
    }));

    await Answer.insertMany(answerDocs);
    res.status(200).json({ message: "Answers submitted successfully" });
  } catch (err) {
    console.error("Submission Error:", err);
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


examRouter.get("/teacher/:teacherId/examlist",authTeacher,async(req,res)=>{
  try{
    const {teacherId}=req.params;
    const examList=await Exam.find({teacherId:teacherId});
    res.status(200).json({message:"Successfully fetched exam list",data:examList})
  }catch(err){
    res.status(500).json({message:"Failed to fetched exams",error:err.message});
  }
})

examRouter.post("/teacher/exam/delete",authTeacher,async(req,res)=>{
  try{
    const {id}=req.body;
    const deletedExam=await Exam.findByIdAndDelete(id);
    if(deletedExam){
      res.status(200).json({message:"deleted succesfully"});
    }
    else{
      res.status(400).json({message: "No exam found with that ID"});
    }
  }catch(err){
    res.status(500).json({message:"Failed to delete exam",error:err.message});
  }
})

examRouter.get("/teacher/exam/:examId",authTeacher,async(req,res)=>{
  try{
    const {examId}=req.params;
    const getExam=await Exam.findById(examId);
    if(getExam){
      return res.status(200).json({message:"exam fetched successfully",data:getExam});
    }
  }catch(err){
    res.status(500).json({message:"Failed to fetched exam",error:err.message});
  }
}  )

examRouter.get("/teacher/fetchquestions/:examId",authTeacher,async(req,res)=>{
  try{
    const {examId}=req.params;
    const  questions=await Exam.findById(examId).populate("questions");
    if(!questions){
      return res.status(400).json({message:"No questions related to this exam found"});
    }
    res.status(200).json({message:"questions fetched succesfully",data:questions});

  }catch(err){
    res.status(500).json({message:"Failed to fetched questions",error:err.message});
  }
})


module.exports = examRouter;
