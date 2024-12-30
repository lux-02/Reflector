import dbConnect from "../../../lib/mongodb";
import Question from "../../../models/Question";

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case "PUT":
      try {
        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        res.status(200).json(updatedQuestion);
      } catch (error) {
        res.status(500).json({ error: "질문 수정에 실패했습니다." });
      }
      break;

    case "DELETE":
      try {
        await Question.findByIdAndDelete(id);
        res.status(200).json({ message: "질문이 삭제되었습니다." });
      } catch (error) {
        res.status(500).json({ error: "질문 삭제에 실패했습니다." });
      }
      break;

    default:
      res.status(405).json({ error: "허용되지 않는 메소드입니다." });
      break;
  }
}
