import { connectToDatabase } from "@/lib/mongodb-adapter";
import Question from "@/models/Question";
import questionsData from "@/data/questions.json";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // MongoDB 연결
    await connectToDatabase();

    // 기존 데이터 삭제
    await Question.deleteMany({});

    // 새로운 데이터 삽입
    const questions = questionsData.questions.map((q) => ({
      text: {
        ko: q.text.ko,
        en: q.text.en,
        jp: q.text.jp,
      },
      category: {
        ko: q.category.ko,
        en: q.category.en,
        jp: q.category.jp,
      },
      answers: [],
    }));

    const result = await Question.insertMany(questions);
    console.log(`${result.length}개의 질문이 성공적으로 생성되었습니다.`);

    res.status(200).json({
      message: "초기 데이터가 성공적으로 생성되었습니다.",
      count: result.length,
    });
  } catch (error) {
    console.error("초기 데이터 생성 중 오류:", error);
    res.status(500).json({
      error: "초기 데이터 생성에 실패했습니다.",
      details: error.message,
    });
  }
}
