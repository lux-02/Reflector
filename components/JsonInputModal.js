import { useState } from "react";
import styles from "@/styles/JsonInputModal.module.css";

export default function JsonInputModal({ onClose, onApply }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data.questions)) {
        throw new Error("questions 배열이 필요합니다");
      }
      onApply(data.questions);
      setError("");
    } catch (err) {
      setError(
        "올바른 JSON 형식이 아닙니다. questions 배열이 포함되어야 합니다."
      );
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>JSON 데이터 입력</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`{
  "questions": [
    {
      "text": "질문 내용",
      "category": "카테고리"
    }
  ]
}`}
            rows={10}
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttons}>
            <button type="submit">적용</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
