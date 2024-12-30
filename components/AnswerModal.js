import { useState } from "react";
import styles from "@/styles/AnswerModal.module.css";

export default function AnswerModal({ question, onClose, onSave }) {
  const [answer, setAnswer] = useState(question.answer || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(question._id, answer);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{question.text}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요..."
            rows={5}
          />
          <div className={styles.buttons}>
            <button type="submit">저장</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
