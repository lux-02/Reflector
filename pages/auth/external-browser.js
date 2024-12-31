import { useEffect } from "react";
import styles from "@/styles/ExternalBrowser.module.css";
import { useLocale } from "@/contexts/LocaleContext";
import Image from "next/image";

export default function ExternalBrowser() {
  const { locale } = useLocale();
  const messages = {
    title: {
      ko: "외부 브라우저로 열기",
      en: "Open in External Browser",
      jp: "外部ブラウザで開く",
    },
    description: {
      ko: "보안상의 이유로 구글 로그인은 외부 브라우저에서만 가능합니다. 아래 버튼을 클릭하여 외부 브라우저에서 로그인해주세요.",
      en: "For security reasons, Google login is only available in external browsers. Please click the button below to login in your external browser.",
      jp: "セキュリティ上の理由により、Googleログインは外部ブラウザでのみ可能です。下のボタンをクリックして外部ブラウザでログインしてください。",
    },
    button: {
      ko: "브라우저에서 열기",
      en: "Open in Browser",
      jp: "ブラウザで開く",
    },
  };

  useEffect(() => {
    // 현재 URL이 이미 외부 브라우저인 경우 로그인 페이지로 리다이렉트
    const isExternalBrowser =
      typeof window !== "undefined" &&
      !window.navigator.userAgent.includes("wv") &&
      (!/iPhone|iPod|iPad/.test(window.navigator.userAgent) ||
        /Safari/.test(window.navigator.userAgent));

    if (isExternalBrowser) {
      window.location.href = "/api/auth/signin";
    }
  }, []);

  const handleOpenBrowser = () => {
    // 시스템 브라우저로 열기
    window.location.href = window.location.origin + "/api/auth/signin";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Reflector Logo"
            width={80}
            height={80}
            priority
            className={styles.logo}
          />
        </div>
        <h1 className={styles.title}>{messages.title[locale]}</h1>
        <p className={styles.description}>{messages.description[locale]}</p>
        <button onClick={handleOpenBrowser} className={styles.button}>
          {messages.button[locale]}
        </button>
      </div>
    </div>
  );
}
