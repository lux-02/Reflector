import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "@/styles/Profile.module.css";
import Image from "next/image";
import AnswerModal from "@/components/AnswerModal";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnswers();
    }
  }, [status]);

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`/api/questions?userId=${session.user.id}`);
      const data = await response.json();
      const answeredQuestions = data.filter((q) => q.answer);

      setTotalQuestions(data.length);
      setAnsweredCount(answeredQuestions.length);

      const groupedAnswers = answeredQuestions.reduce((acc, question) => {
        if (!acc[question.category]) {
          acc[question.category] = [];
        }
        acc[question.category].push(question);
        return acc;
      }, {});

      setAnswers(groupedAnswers);
    } catch (error) {
      console.error("답변을 불러오는데 실패했습니다:", error);
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

      if (response.ok) {
        await fetchAnswers();
        setShowModal(false);
        setSelectedQuestion(null);
      } else {
        const data = await response.json();
        console.error("답변 저장 실패:", data.error);
        alert("답변 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("답변 저장 실패:", error);
      alert("답변 저장 중 오류가 발생했습니다.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← 돌아가기
      </button>

      <div className={styles.profileHeader}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Reflector Logo"
            width={80}
            height={80}
            className={styles.headerLogo}
            priority
          />
        </div>
        <h1 className={styles.profileName}>{session?.user?.name}</h1>
        <div className={styles.statsWrapper}>
          <div className={styles.stats}>
            <span className={styles.completedCount}>{answeredCount}</span>
            <span className={styles.totalCount}>/ {totalQuestions}</span>
          </div>
          <p className={styles.statsLabel}>답변 완료</p>
        </div>
      </div>

      <div className={styles.answersContainer}>
        {Object.entries(answers).map(([category, questions]) => (
          <div key={category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.questionList}>
              {questions.map((question) => (
                <div
                  key={question._id}
                  className={styles.answerCard}
                  onClick={() => handleQuestionClick(question)}
                >
                  <h3 className={styles.questionText}>{question.text}</h3>
                  <p className={styles.answerText}>
                    &gt;&gt; {question.answer}
                  </p>
                  <button className={styles.editButton}>수정하기</button>
                </div>
              ))}
            </div>
          </div>
        ))}
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
