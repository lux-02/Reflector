import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Home.module.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import AnswerModal from "@/components/AnswerModal";
import Image from "next/image";
import CategoryModal from "@/components/CategoryModal";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const categoryRefs = useRef({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const scrollRef = useRef(null);

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
  const categories = Object.keys(groupedQuestions);

  useEffect(() => {
    if (categories.length > 0 && !currentCategory) {
      setCurrentCategory(categories[0]);
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    const categoryElement = document.querySelector(
      `[data-category="${category}"]`
    );
    if (categoryElement && scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const scrollLeft =
        categoryElement.offsetLeft - scrollContainer.offsetLeft - 16;
      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (currentCategory) {
      const categoryElement = document.querySelector(
        `[data-category="${currentCategory}"]`
      );
      if (categoryElement && scrollRef.current) {
        const scrollContainer = scrollRef.current;
        const scrollLeft =
          categoryElement.offsetLeft - scrollContainer.offsetLeft - 16;
        scrollContainer.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentCategory]);

  const sortQuestionsByAnswer = (questions) => {
    return [...questions].sort((a, b) => {
      if (a.answer && !b.answer) return 1;
      if (!a.answer && b.answer) return -1;
      return 0;
    });
  };

  const getCompletedCount = (questions) => {
    return questions.filter((q) => q.answer).length;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.png"
              alt="Reflector Logo"
              width={32}
              height={32}
              className={styles.headerLogo}
              priority
            />
          </div>
          <span>{session?.user?.name}</span>
        </div>
        <button onClick={() => signOut()} className={styles.signOutButton}>
          로그아웃
        </button>
      </div>

      {questions.length === 0 && (
        <button
          onClick={initializeData}
          disabled={isLoading}
          className={styles.initButton}
        >
          {isLoading ? "초기화 중..." : "초기 데이터 생성"}
        </button>
      )}

      <nav className={styles.categoryNav}>
        <div className={styles.categoryNavWrapper}>
          <button
            className={styles.viewAllButton}
            onClick={() => setShowCategoryModal(true)}
          >
            <span>전체 보기</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className={styles.categoryScroll} ref={scrollRef}>
            {categories.map((category) => (
              <button
                key={category}
                data-category={category}
                className={`${styles.categoryTab} ${
                  currentCategory === category ? styles.active : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className={styles.categoryContainer}>
        {currentCategory && groupedQuestions[currentCategory] && (
          <div className={styles.category}>
            <div className={styles.categoryTitleWrapper}>
              <h2 className={styles.categoryTitle}>{currentCategory}</h2>
              <div className={styles.questionCount}>
                <span className={styles.completedCount}>
                  {getCompletedCount(groupedQuestions[currentCategory])}
                </span>
                <span className={styles.totalCount}>
                  / {groupedQuestions[currentCategory].length}
                </span>
              </div>
            </div>
            <div className={styles.questionList}>
              {sortQuestionsByAnswer(groupedQuestions[currentCategory]).map(
                (question) => (
                  <div
                    key={question._id}
                    className={`${styles.questionItem} ${
                      question.answer ? styles.answered : ""
                    }`}
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question.text}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          currentCategory={currentCategory}
          onSelect={handleCategoryClick}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

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
