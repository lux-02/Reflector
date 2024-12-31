import styles from "@/styles/CategoryModal.module.css";
import { useLocale } from "@/contexts/LocaleContext";

export default function CategoryModal({
  categories,
  onSelect,
  onClose,
  currentCategory,
}) {
  const { locale } = useLocale();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>카테고리 전체 보기</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              key={JSON.stringify(category)}
              className={`${styles.categoryItem} ${
                JSON.stringify(currentCategory) === JSON.stringify(category)
                  ? styles.active
                  : ""
              }`}
              onClick={() => {
                onSelect(category);
                onClose();
              }}
            >
              {category[locale]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
