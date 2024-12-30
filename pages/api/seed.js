import dbConnect from "../../lib/mongodb";
import Question from "../../models/Question";
import questionsData from "../../data/questions.json";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    await Question.deleteMany({}); // 기존 데이터 삭제
    await Question.insertMany(questionsData.questions);
    res.status(200).json({ message: "데이터베이스 초기화 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "데이터베이스 초기화 실패" });
  }
}
