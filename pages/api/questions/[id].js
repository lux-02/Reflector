import dbConnect from "../../../lib/mongodb";
import Question from "../../../models/Question";

export default async function handler(req, res) {
  const { id } = req.query;
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "사용자 인증이 필요합니다." });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("데이터베이스 연결 오류:", error);
    return res.status(500).json({ error: "데이터베이스 연결에 실패했습니다." });
  }

  switch (req.method) {
    case "PUT":
      try {
        console.log("Updating question:", id, "for user:", userId);

        const question = await Question.findById(id);
        if (!question) {
          console.log("Question not found:", id);
          return res.status(404).json({ error: "질문을 찾을 수 없습니다." });
        }

        // 기존 답변 찾기
        const answerIndex = question.answers.findIndex(
          (a) => a.userId === userId
        );

        console.log("Current answers:", question.answers);
        console.log("Answer index:", answerIndex);

        if (answerIndex > -1) {
          // 기존 답변 업데이트
          question.answers[answerIndex].content = req.body.answer;
        } else {
          // 새 답변 추가
          question.answers.push({
            userId,
            content: req.body.answer,
          });
        }

        const savedQuestion = await question.save();
        console.log("Saved question:", savedQuestion);

        res.status(200).json(savedQuestion);
      } catch (error) {
        console.error("답변 저장 중 오류 발생:", error);
        res.status(500).json({
          error: "답변 저장에 실패했습니다.",
          details: error.message,
        });
      }
      break;

    default:
      res.status(405).json({ error: "허용되지 않는 메소드입니다." });
      break;
  }
}
