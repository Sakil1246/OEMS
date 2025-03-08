const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  semester: { type: Number, required: true },
  examName: { type: String, required: true },
  subjectName: { type: String, required: true },
  startTime: { 
    type: Date, required: true, 
    validate: {
      validator: function(value) {
        return value > new Date(); 
      },
      message: "Exam start time must be in the future."
    }
  },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number },
  department:{ type: String, required: true},
  aboutExam: { type: String },
  duration: { type: Number, required: true }, //  minutes
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

module.exports = mongoose.model("Exam", examSchema);
