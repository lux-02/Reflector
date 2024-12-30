import mongoose from "mongoose";

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
  answer: {
    type: String,
    default: "",
  },
});

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
