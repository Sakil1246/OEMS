const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionImage: { type: String }, 
  options: [
    {
      format: { type: String, required: true, enum: ["Text", "Image"] },
      text: { type: String },
      image: { type: String } 
    }
  ],
  correctOptions: { 
  type: Number,
  required: function() {
    return this.questionType === "MCQ" || this.questionType === "MSQ";
  },
  validate: {
    validator: function(value) {
      if (this.questionType === "MCQ" || this.questionType === "MSQ") {
        return typeof value === 'number';
      }
      return true; 
    },
    message: props => `${props.path} is invalid`
  }
}
,
  bloomLevel: { type: String, required: true },
  questionType: { type: String, enum: ["MCQ", "MSQ", "Subjective"], required: true },  
  questionFormat: { type: String, enum: ["Image", "Text"], required: true },
  marks: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
},{timestamps: true});

module.exports = mongoose.model("Question", questionSchema);
