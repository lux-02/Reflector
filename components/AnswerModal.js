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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.question} lang={locale}>
          {question.text[locale]}
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={translations.answerPlaceholder[locale]}
            className={styles.answerInput}
            required
          />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.saveButton} lang={locale}>
              {translations.save[locale]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
