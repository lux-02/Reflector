import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    text: {
      ko: { type: String, required: true },
      en: { type: String, required: true },
      jp: { type: String, required: true },
    },
    category: {
      ko: { type: String, required: true },
      en: { type: String, required: true },
      jp: { type: String, required: true },
    },
    answers: [
      {
        userId: { type: String, required: true },
        answer: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
