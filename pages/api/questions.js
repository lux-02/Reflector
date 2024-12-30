import dbConnect from "../../lib/mongodb";
import Question from "../../models/Question";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("데이터베이스 연결 오류:", error);
    return res.status(500).json({ error: "데이터베이스 연결에 실패했습니다." });
  }

  switch (req.method) {
    case "GET":
      try {
        const questions = await Question.find({}).lean();
        res.status(200).json(questions);
      } catch (error) {
        console.error("질문 조회 오류:", error);
        res.status(500).json({ error: "질문을 불러오는데 실패했습니다." });
      }
      break;

    case "POST":
      try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
      } catch (error) {
        console.error("질문 생성 오류:", error);
        res.status(500).json({ error: "질문을 생성하는데 실패했습니다." });
      }
      break;

    default:
      res.status(405).json({ error: "허용되지 않는 메소드입니다." });
      break;
  }
}
