import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Home.module.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import AnswerModal from "@/components/AnswerModal";
import Image from "next/image";
import CategoryModal from "@/components/CategoryModal";
import { useLocale } from "@/contexts/LocaleContext";
import LanguageSelector from "@/components/LanguageSelector";
import { translations } from "@/constants/translations";
import { event, ANALYTICS_EVENTS } from "@/utils/analytics";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const categoryRefs = useRef({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const scrollRef = useRef(null);
  const { locale } = useLocale();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("질문 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
    event({
      ...ANALYTICS_EVENTS.VIEW_QUESTION,
      label: question.text[locale],
      value: question._id,
    });
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
        event({
          ...ANALYTICS_EVENTS.ANSWER_QUESTION,
          label: selectedQuestion.text[locale],
          value: questionId,
        });
        await fetchData();
        setShowModal(false);
        setSelectedQuestion(null);
      } else {
        const data = await response.json();
        console.error("답변 저장 실패:", data.error);
        alert("답변 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("답변 저장 중 오류:", error);
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
        await fetchData();
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
      const categoryKey = JSON.stringify(question.category);
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }
      grouped[categoryKey].push(question);
    });
    return grouped;
  };

  const groupedQuestions = groupQuestionsByCategory();
  const categories = Object.keys(groupedQuestions).map((key) =>
    JSON.parse(key)
  );

  useEffect(() => {
    if (categories.length > 0 && !currentCategory) {
      setCurrentCategory(categories[0]);
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    event({
      ...ANALYTICS_EVENTS.CHANGE_CATEGORY,
      label: category[locale],
    });
    const categoryElement = document.querySelector(
      `[data-category='${JSON.stringify(category)}']`
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
        `[data-category='${JSON.stringify(currentCategory)}']`
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
      const aAnswer = a.answers?.find((ans) => ans.userId === session.user.id);
      const bAnswer = b.answers?.find((ans) => ans.userId === session.user.id);
      if (aAnswer?.answer && !bAnswer?.answer) return 1;
      if (!aAnswer?.answer && bAnswer?.answer) return -1;
      return 0;
    });
  };

  const getCompletedCount = (questions) => {
    return questions.filter((q) => {
      const userAnswer = q.answers?.find((a) => a.userId === session.user.id);
      return userAnswer && userAnswer.answer;
    }).length;
  };

  if (status === "loading") {
    return <div>{translations.loading[locale]}</div>;
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
          <span
            onClick={() => router.push("/profile")}
            className={styles.profileName}
          >
            {session?.user?.name}
          </span>
        </div>
        <div className={styles.headerActions}>
          <LanguageSelector />
          <button
            onClick={() => signOut()}
            className={styles.signOutButton}
            lang={locale}
          >
            {translations.signOut[locale]}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <main className={styles.main}>
          <nav className={styles.categoryNav}>
            <div className={styles.categoryNavWrapper}>
              <button
                className={styles.viewAllButton}
                onClick={() => setShowCategoryModal(true)}
                lang={locale}
              >
                <span>{translations.viewAll[locale]}</span>
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
                    key={JSON.stringify(category)}
                    data-category={JSON.stringify(category)}
                    className={`${styles.categoryTab} ${
                      JSON.stringify(currentCategory) ===
                      JSON.stringify(category)
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                    lang={locale}
                  >
                    {category[locale]}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className={styles.categoryContainer}>
            {currentCategory &&
              groupedQuestions[JSON.stringify(currentCategory)] && (
                <div className={styles.category}>
                  <div className={styles.categoryTitleWrapper}>
                    <h2 className={styles.categoryTitle} lang={locale}>
                      {currentCategory[locale]}
                    </h2>
                    <div className={styles.questionCount}>
                      <span className={styles.completedCount}>
                        {getCompletedCount(
                          groupedQuestions[JSON.stringify(currentCategory)]
                        )}
                      </span>
                      <span className={styles.totalCount}>
                        /{" "}
                        {
                          groupedQuestions[JSON.stringify(currentCategory)]
                            .length
                        }
                      </span>
                    </div>
                  </div>
                  <div className={styles.questionList}>
                    {sortQuestionsByAnswer(
                      groupedQuestions[JSON.stringify(currentCategory)]
                    ).map((question) => (
                      <div
                        key={question._id}
                        className={`${styles.questionItem} ${
                          question.answers?.find(
                            (a) => a.userId === session.user.id && a.answer
                          )
                            ? styles.answered
                            : ""
                        }`}
                        onClick={() => handleQuestionClick(question)}
                      >
                        <span lang={locale}>{question.text[locale]}</span>
                      </div>
                    ))}
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
        </main>
      )}
    </div>
  );
}
