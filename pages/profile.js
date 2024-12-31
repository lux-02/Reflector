import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.css";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { translations } from "@/constants/translations";
import LanguageSelector from "@/components/LanguageSelector";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const { locale } = useLocale();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnsweredQuestions();
    }
  }, [status]);

  const fetchAnsweredQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?userId=${session.user.id}`);
      const questions = await response.json();
      const answered = getAnsweredQuestions(questions);
      setAnsweredQuestions(answered);
    } catch (error) {
      console.error("답변한 질문을 불러오는데 실패했습니다:", error);
    }
  };

  const getAnsweredQuestions = (questions) => {
    return questions.filter((question) => {
      const userAnswer = question.answers?.find(
        (answer) => answer.userId === session.user.id && answer.answer
      );
      return userAnswer;
    });
  };

  if (status === "loading") {
    return <div>{translations.loading[locale]}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => router.push("/")}
          className={styles.backButton}
          lang={locale}
        >
          {translations.profile.backToHome[locale]}
        </button>
        <LanguageSelector />
      </div>

      <div className={styles.profile}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Reflector Logo"
            width={100}
            height={100}
            className={styles.logo}
            priority
          />
        </div>
        <h1>{session?.user?.name}</h1>
      </div>

      <section className={styles.answeredSection}>
        {answeredQuestions.length === 0 ? (
          <div className={styles.noAnswers}>
            <p lang={locale}>{translations.profile.noAnswers[locale]}</p>
            <button
              onClick={() => router.push("/")}
              className={styles.startButton}
              lang={locale}
            >
              {translations.profile.startAnswering[locale]}
            </button>
          </div>
        ) : (
          <div className={styles.questionList}>
            {answeredQuestions.map((question) => (
              <div key={question._id} className={styles.questionItem}>
                <h3 className={styles.questionText} lang={locale}>
                  {question.text[locale]}
                </h3>
                <p className={styles.answerText}>
                  {
                    question.answers.find((a) => a.userId === session.user.id)
                      ?.answer
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
