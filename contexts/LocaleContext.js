import { createContext, useContext, useState, useEffect } from "react";

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState("ko"); // 기본값 한국어

  useEffect(() => {
    // 브라우저의 언어 설정 감지
    const browserLocale = navigator.language.split("-")[0];
    // 지원하는 언어인 경우에만 설정
    if (["ko", "en", "jp"].includes(browserLocale)) {
      setLocale(browserLocale);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
