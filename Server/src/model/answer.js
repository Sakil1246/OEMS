const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  answerText: { type: String }, 
  selectedOption: { type: Number }, 
  evaluated: { type: Boolean, default: false },
  marksObtained: { type: Number, default: 0 }
},{timestamps: true});

module.exports = mongoose.model("Answer", answerSchema);
