const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  answerText: { type: String }, // for subjective answer
  selectedOption: { type: Number }, // for MCQ selection
  evaluated: { type: Boolean, default: false }, // Teacher marks evaluation status
  marksObtained: { type: Number, default: 0 }
},{timestamps: true});

module.exports = mongoose.model("Answer", answerSchema);
