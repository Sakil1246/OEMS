const { default: mongoose } = require("mongoose");
const answer = require("./answer");

const examResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      selectedOption: { type: Number },
      subjectiveAnswer: { type: String },
      answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" ,required: true },
      
    }
  ],
  
  score: {
    type: Number,
    default: 0
  },
  evaluated: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("ExamResult", examResultSchema);
