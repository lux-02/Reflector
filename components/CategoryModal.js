import styles from "@/styles/CategoryModal.module.css";

export default function CategoryModal({
  categories,
  onSelect,
  onClose,
  currentCategory,
}) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>카테고리 목록</h2>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryItem} ${
                currentCategory === category ? styles.active : ""
              }`}
              onClick={() => {
                onSelect(category);
                onClose();
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
