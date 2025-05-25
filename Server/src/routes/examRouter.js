const express = require("express");
const { authTeacher, authStudent } = require("../middlewares/auth");
const examController = require("../controllers/exam.Controller");
const router = express.Router();

router.post("/upload", examController.upload.single("file"), examController.uploadExamImage);

// Teacher routes
router.post("/teacher/exam/create", authTeacher, examController.createExam);
router.get("/teacher/:teacherId/examlist", authTeacher, examController.teacherExamList);
router.post("/teacher/exam/delete", authTeacher, examController.deleteExam);
router.get("/teacher/exam/:examId", authTeacher, examController.getExamById);
router.get("/teacher/fetchquestions/:examId", authTeacher, examController.fetchTeacherExamQuestions);
router.get("/teacher/:examId/answers/count", authTeacher, examController.getAnswersCount);
router.get("/teacher/:examId/answers/submittingstudents", authTeacher, examController.getSubmittedStudents);
router.post("/teacher/answer/:answerId/evaluate", authTeacher, examController.evaluateAnswerById);
router.post("/teacher/answer/:answerId/reset", authTeacher, examController.resetAnswerEvaluation);
router.post("/teacher/:examId/student/:studentId/reset-evaluation", authTeacher, examController.resetStudentEvaluation);
router.post("/teacher/:examId/student/:studentId/finalize-evaluation", authTeacher, examController.finalizeEvaluation);
router.post("/teacher/update-results", authTeacher, examController.updateResults);
router.get("/exam/:examId/batchmate-scores", authStudent, examController.getBatchmateScores);
router.get('/teacher/:examId/student/:studentId/answers', authTeacher, examController.getStudentAnswers);
router.post('teacher/updateexam/:id', authTeacher, examController.updateExam);
//router.post('teacher/updatequestions/:id', authTeacher, examController.updateExamQuestions);
// Student routes
router.get("/student/exam/list", authStudent, examController.listStudentExams);
router.get("/student/exam/:examId/questions", authStudent, examController.getExamQuestions);
router.post("/student/exam/submit/:examId", authStudent, examController.submitExamAnswers);
router.get("/student/:studentId/attempted-exams", examController.listAttemptedExams);
router.get('/exam/:examId/result-details', authStudent, examController.getExamResultDetails);
router.post('student/exam/:examId/message', authStudent, examController.studentExamMessage);

module.exports = router;
