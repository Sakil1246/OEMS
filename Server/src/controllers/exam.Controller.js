const Exam = require("../model/exam");
const Question = require("../model/question");
const Answer = require("../model/answer");
const examResult = require("../model/examResult");
const student = require("../model/student");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const moment = require("moment-timezone");
const { parse, format } = require("date-fns");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.memoryStorage(); 
const upload = multer({ storage });


const uploadExamImage = async (req, res) => {
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
};

const createExam = async (req, res) => {
  try {
    let {
      semester, examName, startTime, duration, questions,
      subjectName, totalMarks, passingMarks, aboutExam, department
    } = req.body;

   
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
};

const listStudentExams = async (req, res) => {
  try {
    const exams = await Exam.find({})
      .populate("teacherId", "firstName lastName")
      .select("semester examName subjectName startTime duration totalMarks department _id teacherId")
      .sort({ startTime: 1 });

    const examsList = exams.map((exam) => {
      let startTime = new Date(exam.startTime);
      if (typeof exam.startTime === "string") {
        startTime = parse(exam.startTime, "dd/MM/yyyy, hh:mm a", new Date());
      }
      const endTime = new Date(startTime.getTime() + exam.duration * 60000);
      return {
        semester: exam.semester,
        examName: exam.examName,
        subjectName: exam.subjectName,
        examDate: format(startTime, "dd/MM/yyyy, hh:mm a"),
        duration: exam.duration,
        department: exam.department,
        totalMarks: exam.totalMarks,
        endTime: format(endTime, "dd/MM/yyyy, hh:mm a"),
        examId: exam._id,
        teacherId: exam.teacherId._id,
        teacherFirstName: exam.teacherId.firstName,
        teacherLastName: exam.teacherId.lastName,
      };
    });

    res.json(examsList);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

const getExamQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate("questions");
    if (!exam) return res.status(404).json({ message: "Exam not found." });
    res.status(200).json({ questions: exam.questions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", error: err.message });
  }
};

const submitExamAnswers = async (req, res) => {
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
};

const evaluateAnswer = async (req, res) => {
  try {
    const { answerId, marksObtained } = req.body;
    const answerDoc = await Answer.findById(answerId);
    if (!answerDoc) return res.status(404).json({ message: "Answer not found." });
    answerDoc.marksObtained = marksObtained;
    answerDoc.evaluated = true;
    await answerDoc.save();
    res.status(200).json({ message: "Answer evaluated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Evaluation failed", error: err.message });
  }
};

const teacherExamList = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const examList = await Exam.find({ teacherId: teacherId });
    res.status(200).json({ message: "Successfully fetched exam list", data: examList });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch exams", error: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedExam = await Exam.findByIdAndDelete(id);
    if (deletedExam) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(400).json({ message: "No exam found with that ID" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to delete exam", error: err.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const examDoc = await Exam.findById(examId);
    if (examDoc) {
      res.status(200).json({ message: "Exam fetched successfully", data: examDoc });
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch exam", error: err.message });
  }
};

const fetchTeacherExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    const questionsData = await Exam.findById(examId).populate("questions");
    if (!questionsData) {
      return res.status(400).json({ message: "No questions related to this exam found" });
    }
    res.status(200).json({ message: "Questions fetched successfully", data: questionsData });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", error: err.message });
  }
};

const getAnswersCount = async (req, res) => {
  try {
    const { examId } = req.params;
    const result = await Answer.aggregate([
      { $match: { examId: new mongoose.Types.ObjectId(examId) } },
      { $group: { _id: "$studentId" } },
      { $count: "submittedStudents" }
    ]);
    const count = result[0]?.submittedStudents || 0;
    res.status(200).json({ message: "Successfully fetched answers count", data: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch answers count", error: err.message });
  }
};

const getSubmittedStudents = async (req, res) => {
  try {
    const { examId } = req.params;
    const answers = await Answer.find({ examId: new mongoose.Types.ObjectId(examId) });
    const studentMap = {};
    for (let ans of answers) {
      const sid = ans.studentId.toString();
      if (!studentMap[sid]) {
        studentMap[sid] = { totalMarks: 0, totalAnswers: 0, evaluatedAnswers: 0 };
      }
      studentMap[sid].totalAnswers += 1;
      if (ans.evaluated) {
        studentMap[sid].evaluatedAnswers += 1;
        studentMap[sid].totalMarks += ans.marksObtained || 0;
      }
    }
    const studentIds = Object.keys(studentMap);
    const studentsData = await student.find({ _id: { $in: studentIds } }).select("rollNo firstName lastName").lean();
    const result = studentsData.map(stu => {
      const sid = stu._id.toString();
      const data = studentMap[sid];
      return {
        ...stu,
        evaluated: data.totalAnswers === data.evaluatedAnswers,
        marksObtained: data.totalMarks
      };
    });
    res.status(200).json({ message: "Fetched students who submitted answers", data: result });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
};

const evaluateAnswerById = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { marksObtained, evaluated } = req.body;
    if (typeof marksObtained !== 'number' || marksObtained < 0) {
      return res.status(400).json({ message: "Invalid marks value" });
    }
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { $set: { marksObtained, evaluated } },
      { new: true }
    );
    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json({ message: "Answer evaluated successfully", data: updatedAnswer });
  } catch (err) {
    res.status(500).json({ message: "Error evaluating answer", error: err.message });
  }
};

const resetAnswerEvaluation = async (req, res) => {
  try {
    const { answerId } = req.params;
    const answerDoc = await Answer.findById(answerId);
    if (!answerDoc) return res.status(404).json({ message: 'Answer not found' });
    answerDoc.evaluated = false;
    answerDoc.marksObtained = 0;
    await answerDoc.save();
    res.status(200).json({ message: 'Answer evaluation reset successfully' });
  } catch (err) {
    console.error('Error resetting answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetStudentEvaluation = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const result = await Answer.updateMany(
      { examId, studentId },
      { $set: { evaluated: false, marksObtained: 0 } }
    );
    res.status(200).json({ message: `Evaluation reset for ${result.modifiedCount} answers.` });
  } catch (err) {
    console.error('Error resetting evaluations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const finalizeEvaluation = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const unevaluatedAnswers = await Answer.find({
      examId,
      studentId,
      evaluated: false
    });
    if (unevaluatedAnswers.length > 0) {
      return res.status(400).json({
        message: 'Not all answers are evaluated. Please evaluate all answers before finalizing.'
      });
    }
    const evaluatedAnswers = await Answer.find({
      examId,
      studentId,
      evaluated: true
    });
    const totalScore = evaluatedAnswers.reduce((sum, ans) => sum + (ans.marksObtained || 0), 0);
    const answersForResult = evaluatedAnswers.map(ans => ({
      questionId: ans.questionId,
      selectedOption: ans.selectedOption,
      subjectiveAnswer: ans.answerText || ""
    }));
    const result = await examResult.findOneAndUpdate(
      { examId, studentId },
      { answers: answersForResult, score: totalScore, evaluated: true },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Evaluation finalized successfully.', data: result });
  } catch (error) {
    console.error('Error finalizing evaluation:', error);
    res.status(500).json({ message: 'Server error while finalizing evaluation.' });
  }
};

const listAttemptedExams = async (req, res) => {
  try {
    const { studentId } = req.params;
    const answeredExamIds = await Answer.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      { $group: { _id: "$examId" } },
    ]);
    const examIds = answeredExamIds.map(item => item._id);
    if (examIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    const exams = await Exam.find({ _id: { $in: examIds } }).lean();
    const results = await examResult.find({ studentId: studentId }).lean();
    const responseData = exams.map(examDoc => {
      const result = results.find(r => r.examId.toString() === examDoc._id.toString());
      return { 
        _id: examDoc._id,
        examName: examDoc.examName,
        subjectName: examDoc.subjectName,
        startTime: examDoc.startTime,
        totalMarks: examDoc.totalMarks,
        evaluated: !!result,
        score: result?.score || null,
        teacherId: examDoc.teacherId,
      };
    });
    res.status(200).json({ success: true, data: responseData });
  } catch (err) {
    console.error("Error fetching attempted exams:", err);
    res.status(500).json({ success: false, message: "Failed to fetch attempted exams." });
  }
};

const getExamResultDetails = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { examId } = req.params;
    const result = await examResult.findOne({ studentId, examId })
      .populate({
        path: 'answers.questionId',
        select: 'questionText questionImage questionType correctOptions marks options'
      });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }
    const questionIds = result.answers.map(ans => ans.questionId?._id || ans.questionId);
    const answerDocs = await Answer.find({
      examId,
      studentId,
      questionId: { $in: questionIds }
    }).select('questionId marksObtained');

    const marksMap = {};
    answerDocs.forEach(ans => {
      marksMap[ans.questionId.toString()] = ans.marksObtained;
    });
    const enrichedAnswers = result.answers.map(ans => {
      const qId = ans.questionId._id?.toString() || ans.questionId.toString();
      return { ...ans.toObject(), marksObtained: marksMap[qId] ?? null };
    });
    return res.status(200).json({
      success: true,
      data: { ...result.toObject(), answers: enrichedAnswers }
    });
  } catch (error) {
    console.error("Error fetching result:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateResults = async (req, res) => {
  try {
    const { examId, results } = req.body;
    if (!examId || !Array.isArray(results)) {
      return res.status(400).json({ success: false, message: "Invalid input." });
    }
    for (const resultItem of results) {
      const { studentId, marksObtained } = resultItem;
      await examResult.findOneAndUpdate(
        { studentId, examId },
        { score: marksObtained, evaluated: true },
        { new: true }
      );
    } 
    return res.status(200).json({ success: true, message: "Results updated successfully." });
  } catch (error) {
    console.error("Error updating results:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};


const getBatchmateScores = async (req, res) => {
  try {
    const { examId } = req.params;
    const results = await examResult.find({ examId })
      .populate('studentId', 'rollNo');
    const batchmateScores = results.map(result => ({
      rollNo: result.studentId.rollNo,
      score: result.score
    }));
    return res.status(200).json({ success: true, data: batchmateScores });
  } catch (error) {
    console.error("Error fetching batchmate scores:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


const studentExamMessage = async (req, res) => {
  res.status(200).json({ message: 'Message functionality not implemented yet.' });
};



const getStudentAnswers= async (req, res) => {
  const { examId, studentId } = req.params;

  try {
    const answers = await Answer.find({ examId, studentId })
      .populate({
        path: 'questionId',
        model: 'Question'
      });

    const evaluatedAnswers = answers.map(ans => {
      const q = ans.questionId;
      const isAutoEvaluated = (
        q?.questionType === 'MCQ' &&
        q.correctOptions === parseInt(ans.selectedOption) &&
        !ans.evaluated
      );

      if (isAutoEvaluated) {
        ans.marksObtained = q.marks;
        ans.evaluated = true;
        ans.save(); 
      }

      return ans;
    });

    res.status(200).json({ data: evaluatedAnswers });
  } catch (err) {
    console.error("Error fetching answers with questions:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const updateExam=async (req,res)=>{
  const {id}=req.params;
 const {department,
    semester,
    examName,
    startTime,
    duration,
    subjectName,
    totalMarks,
    passingMarks,
    aboutExam} = req.body;
  try {
    const updateExamDetails=await Exam.findByIdAndUpdate(id,{
      department,
      semester,
      examName,
      startTime,
      duration,
      subjectName,
      totalMarks,
      passingMarks,
      about:aboutExam
    },{new:true});
    if(!updateExamDetails){
      return res.status(404).json({message:"Exam not found"});
    }
    res.status(200).json({message:"Exam updated successfully",data:updateExamDetails});
  }
  catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ message: "Server error while updating exam." });
  }
}

const updateExamQuestions = async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "At least one question must be provided." });
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    const newQuestionIds = [];

    // Process each question
    for (const question of questions) {
      question.createdBy = req.teacher._id;

      if (question._id) {
        // Update existing question
        await Question.findByIdAndUpdate(question._id, question, { new: true, runValidators: true });
        newQuestionIds.push(question._id); // keep it
      } else {
        // Insert new question
        const newQ = new Question(question);
        await newQ.save();
        newQuestionIds.push(newQ._id); // add new id
      }
    }

    // Update exam's questions array
    exam.questions = newQuestionIds;
    await exam.save();

    res.status(200).json({ message: "Questions updated successfully", examId: exam._id });
  } catch (error) {
    console.error("Error updating exam questions:", error);
    res.status(500).json({ message: "Server error while updating exam questions." });
  }
};


module.exports = {
  uploadExamImage,
  upload,
  createExam,
  listStudentExams,
  getExamQuestions,
  submitExamAnswers,
  evaluateAnswer,
  teacherExamList,
  deleteExam,
  getExamById,
  fetchTeacherExamQuestions,
  getAnswersCount,
  getSubmittedStudents,
  evaluateAnswerById,
  resetAnswerEvaluation,
  resetStudentEvaluation,
  finalizeEvaluation,
  listAttemptedExams,
  getExamResultDetails,
  updateResults,
  getBatchmateScores,
  studentExamMessage,
  getStudentAnswers,
  updateExam,
  updateExamQuestions
};
