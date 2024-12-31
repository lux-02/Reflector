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
      !/Instagram|FBAV|FBAN/.test(window.navigator.userAgent) &&
      (!/iPhone|iPod|iPad/.test(window.navigator.userAgent) ||
        /Safari/.test(window.navigator.userAgent));

    if (isExternalBrowser) {
      window.location.href = "/api/auth/signin";
    }
  }, []);

  const handleOpenBrowser = () => {
    const loginUrl = window.location.origin + "/api/auth/signin";
    const ua = navigator.userAgent.toLowerCase();

    // Instagram 웹뷰 감지
    if (ua.includes("instagram")) {
      // iOS Instagram
      if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
        window.location.href = `safari-https://${loginUrl.replace(
          /^https?:\/\//,
          ""
        )}`;
      }
      // Android Instagram
      else if (ua.includes("android")) {
        window.location.href = `intent://${loginUrl.replace(
          /^https?:\/\//,
          ""
        )}#Intent;scheme=https;package=com.android.chrome;end`;
      }
      return;
    }

    // 일반 iOS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      // Safari로 바로 열기 시도
      window.location.href = `safari-https://${loginUrl.replace(
        /^https?:\/\//,
        ""
      )}`;

      // 실패할 경우 Chrome으로 시도
      setTimeout(() => {
        window.location.href = `googlechrome://${loginUrl.replace(
          /^https?:\/\//,
          ""
        )}`;
      }, 1000);
    }
    // 일반 Android
    else if (/Android/.test(navigator.userAgent)) {
      window.location.href = `intent://${loginUrl.replace(
        /^https?:\/\//,
        ""
      )}#Intent;scheme=https;package=com.android.chrome;end`;
    }
    // 기타 환경
    else {
      window.open(loginUrl, "_system");
      // 백업으로 일반 링크도 시도
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 1000);
    }
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
