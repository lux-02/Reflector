import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Admin.module.css";

export default function Admin() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    category: "",
  });
  const fileInputRef = useRef(null);

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

  const handleEdit = (question) => {
    setEditingQuestion(question);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/questions/${editingQuestion._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingQuestion),
      });

      if (response.ok) {
        await fetchQuestions();
        setEditingQuestion(null);
      }
    } catch (error) {
      console.error("질문 수정 실패:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchQuestions();
      }
    } catch (error) {
      console.error("질문 삭제 실패:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        await fetchQuestions();
        setNewQuestion({ text: "", category: "" });
      }
    } catch (error) {
      console.error("질문 추가 실패:", error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("모든 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;

    try {
      const response = await fetch("/api/questions/clear", {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchQuestions();
      }
    } catch (error) {
      console.error("전체 삭제 실패:", error);
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data.questions)) {
        alert("올바른 형식의 JSON 파일이 아닙니다.");
        return;
      }

      const response = await fetch("/api/questions/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: data.questions }),
      });

      if (response.ok) {
        await fetchQuestions();
        alert("질문이 성공적으로 임포트되었습니다.");
      }
    } catch (error) {
      console.error("파일 임포트 실패:", error);
      alert("파일 임포트에 실패했습니다.");
    }
    fileInputRef.current.value = "";
  };

  return (
    <div className={styles.container}>
      <h1>관리자 페이지</h1>

      <div className={styles.adminActions}>
        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
          ref={fileInputRef}
          className={styles.fileInput}
        />
        <button onClick={handleClearAll} className={styles.dangerButton}>
          전체 삭제
        </button>
      </div>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <h2>새 질문 추가</h2>
        <input
          type="text"
          placeholder="질문"
          value={newQuestion.text}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, text: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="카테고리"
          value={newQuestion.category}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, category: e.target.value })
          }
          required
        />
        <button type="submit">추가</button>
      </form>

      <div className={styles.questionList}>
        {questions.map((question) =>
          editingQuestion?._id === question._id ? (
            <div key={question._id} className={styles.editForm}>
              <input
                type="text"
                value={editingQuestion.text}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    text: e.target.value,
                  })
                }
              />
              <input
                type="text"
                value={editingQuestion.category}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    category: e.target.value,
                  })
                }
              />
              <button onClick={handleUpdate}>저장</button>
              <button onClick={() => setEditingQuestion(null)}>취소</button>
            </div>
          ) : (
            <div key={question._id} className={styles.questionItem}>
              <div className={styles.questionInfo}>
                <h3>{question.text}</h3>
                <p>카테고리: {question.category}</p>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(question)}>수정</button>
                <button onClick={() => handleDelete(question._id)}>삭제</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
