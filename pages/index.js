import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("질문을 불러오는데 실패했습니다:", error);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || "");
  };

  const initializeData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });
      if (response.ok) {
        await fetchQuestions();
      } else {
        console.error("초기 데이터 생성 실패");
      }
    } catch (error) {
      console.error("초기 데이터 생성 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupQuestionsByCategory = () => {
    const grouped = {};
    questions.forEach((question) => {
      if (!grouped[question.category]) {
        grouped[question.category] = [];
      }
      grouped[question.category].push(question);
    });
    return grouped;
  };

  const groupedQuestions = groupQuestionsByCategory();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profile}>
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className={styles.avatar}
            />
          )}
          <span>{session?.user?.name}</span>
        </div>
        <button onClick={() => signOut()} className={styles.signOutButton}>
          로그아웃
        </button>
      </div>

      <h1>Reflector</h1>

      {questions.length === 0 && (
        <button
          onClick={initializeData}
          disabled={isLoading}
          className={styles.initButton}
        >
          {isLoading ? "초기화 중..." : "초기 데이터 생성"}
        </button>
      )}

      <div className={styles.categoryContainer}>
        {Object.entries(groupedQuestions).map(
          ([category, categoryQuestions]) => (
            <div key={category} className={styles.category}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <div className={styles.questionList}>
                {categoryQuestions.map((question) => (
                  <div
                    key={question._id}
                    className={`${styles.questionItem} ${
                      selectedQuestion?._id === question._id
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question.text}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {selectedQuestion && (
        <div className={styles.answerSection}>
          <h2>{selectedQuestion.text}</h2>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요..."
          />
        </div>
      )}
    </div>
  );
}
