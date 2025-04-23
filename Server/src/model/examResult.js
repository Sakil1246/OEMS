const { default: mongoose } = require("mongoose");

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
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      },
      selectedOption: { type: Number },  // For MCQ/MSQ
      subjectiveAnswer: { type: String } // For subjective questions
      // You could also add per-question marks here if needed in future
    }
  ],
  score: {
    type: Number,
    default: 0 // Ensures safe updates from API
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
