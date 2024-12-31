import clientPromise from "@/lib/mongodb-adapter";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const { answer, userId } = req.body;

  if (!answer || !userId) {
    return res.status(400).json({ error: "답변과 사용자 ID가 필요합니다." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("reflector");
    const questions = db.collection("questions");

    const result = await questions.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          answers: [
            {
              userId,
              answer,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "질문을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "답변이 저장되었습니다." });
  } catch (error) {
    console.error("답변 저장 중 오류:", error);
    res.status(500).json({
      error: "답변 저장에 실패했습니다.",
      details: error.message,
    });
  }
}
