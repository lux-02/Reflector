import { useLocale } from "@/contexts/LocaleContext";
import styles from "@/styles/LanguageSelector.module.css";

export default function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  const languages = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "jp", label: "日本語" },
  ];

  return (
    <div className={styles.container}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className={styles.select}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} lang={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
