import { useState, useEffect } from "react";
import styles from "@/styles/AnswerModal.module.css";
import { useSession } from "next-auth/react";
import { useLocale } from "@/contexts/LocaleContext";
import { translations } from "@/constants/translations";

export default function AnswerModal({ question, onClose, onSave }) {
  const [answer, setAnswer] = useState("");
  const { data: session } = useSession();
  const { locale } = useLocale();

  useEffect(() => {
    const userAnswer = question.answers?.find(
      (a) => a.userId === session?.user?.id
    );
    if (userAnswer) {
      setAnswer(userAnswer.answer || "");
    }
  }, [question, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(question._id, answer);
    } catch (error) {
      console.error("답변 저장 중 오류:", error);
      alert("답변 저장에 실패했습니다.");
    }
  };

  const getTranslation = (key, defaultValue = "") => {
    try {
      return translations[key][locale] || defaultValue;
    } catch (error) {
      console.warn(`Translation missing for key: ${key}, locale: ${locale}`);
      return defaultValue;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.question} lang={locale}>
          {question.text?.[locale] || question.text?.ko || ""}
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={getTranslation(
              "answerPlaceholder",
              "답변을 입력하세요..."
            )}
            className={styles.answerInput}
            required
          />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.saveButton} lang={locale}>
              {getTranslation("save", "저장")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
