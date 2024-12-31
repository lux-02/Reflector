import { useRouter } from "next/router";
import styles from "@/styles/Auth.module.css";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;
  const { locale } = useLocale();

  const errorMessages = {
    Configuration: {
      ko: "서버 설정에 문제가 있습니다. 잠시 후 다시 시도해주세요.",
      en: "There is a problem with the server configuration. Please try again later.",
      jp: "サーバーの設定に問題があります。しばらくしてからもう一度お試しください。",
    },
    AccessDenied: {
      ko: "접근이 거부되었습니다.",
      en: "Access denied.",
      jp: "アクセスが拒否されました。",
    },
    Verification: {
      ko: "인증에 실패했습니다.",
      en: "Authentication failed.",
      jp: "認証に失敗しました。",
    },
    Default: {
      ko: "로그인 중 오류가 발생했습니다.",
      en: "An error occurred during login.",
      jp: "ログイン中にエラーが発生しました。",
    },
  };

  const buttonText = {
    ko: "로그인 페이지로 돌아가기",
    en: "Return to Login Page",
    jp: "ログインページに戻る",
  };

  const headerText = {
    ko: "오류 발생",
    en: "Error Occurred",
    jp: "エラーが発生しました",
  };

  const getErrorMessage = (error) => {
    const messages = errorMessages[error] || errorMessages.Default;
    return messages[locale];
  };

  return (
    <div className={styles.container}>
      <div className={styles.signInBox}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Reflector Logo"
            width={120}
            height={120}
            priority
            className={styles.logo}
          />
        </div>
        <h1>{headerText[locale]}</h1>
        <p className={styles.errorMessage}>{getErrorMessage(error)}</p>
        <button
          className={styles.googleButton}
          onClick={() => router.push("/auth/signin")}
        >
          {buttonText[locale]}
        </button>
      </div>
    </div>
  );
}
