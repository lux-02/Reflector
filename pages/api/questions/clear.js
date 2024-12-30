import dbConnect from "../../../lib/mongodb";
import Question from "../../../models/Question";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    await Question.deleteMany({});
    res.status(200).json({ message: "모든 질문이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "질문 삭제에 실패했습니다." });
  }
}
