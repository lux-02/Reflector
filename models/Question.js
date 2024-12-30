import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: "General",
  },
  answers: [AnswerSchema],
});

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
