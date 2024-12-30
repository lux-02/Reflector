import dbConnect from "../../../lib/mongodb";
import Question from "../../../models/Question";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { questions } = req.body;
    await Question.insertMany(questions);
    res.status(200).json({ message: "질문이 성공적으로 임포트되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "질문 임포트에 실패했습니다." });
  }
}
