import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import AnswerModal from "@/components/AnswerModal";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchQuestions();
    }
  }, [status]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?userId=${session.user.id}`);
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("질문을 불러오는데 실패했습니다:", error);
      setQuestions([]);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
  };

  const handleSaveAnswer = async (questionId, answer) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer,
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchQuestions();
        setShowModal(false);
        setSelectedQuestion(null);
      } else {
        console.error("답변 저장 실패:", data.error, data.details);
        alert("답변 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("답변 저장 실패:", error);
      alert("답변 저장 중 오류가 발생했습니다.");
    }
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
    if (!Array.isArray(questions)) return {};

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

  const sortQuestionsByAnswer = (questions) => {
    return [...questions].sort((a, b) => {
      if (a.answer && !b.answer) return 1;
      if (!a.answer && b.answer) return -1;
      return 0;
    });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profile}>
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className={styles.avatar}
              priority
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
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
                {sortQuestionsByAnswer(categoryQuestions).map((question) => (
                  <div
                    key={question._id}
                    className={`${styles.questionItem} ${
                      question.answer ? styles.answered : ""
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

      {showModal && selectedQuestion && (
        <AnswerModal
          question={selectedQuestion}
          onClose={handleCloseModal}
          onSave={handleSaveAnswer}
        />
      )}
    </div>
  );
}
