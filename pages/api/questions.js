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
        const questionsWithUserAnswers = questions.map((question) => ({
          ...question,
          answer:
            question.answers?.find((a) => a.userId === req.query.userId)
              ?.content || "",
        }));
        res.status(200).json(questionsWithUserAnswers);
      } catch (error) {
        console.error("질문 조회 오류:", error);
        res.status(500).json({ error: "질문을 불러오는데 실패했습니다." });
      }
      break;

    case "POST":
      try {
        const { text, category } = req.body;

        if (!text || !category) {
          return res
            .status(400)
            .json({ error: "질문과 카테고리는 필수입니다." });
        }

        const question = await Question.create({
          text,
          category,
          answers: [],
        });

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
