import { useRouter } from "next/router";
import styles from "@/styles/Auth.module.css";
import Image from "next/image";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (error) => {
    switch (error) {
      case "Configuration":
        return "서버 설정에 문제가 있습니다. 잠시 후 다시 시도해주세요.";
      case "AccessDenied":
        return "접근이 거부되었습니다.";
      case "Verification":
        return "인증에 실패했습니다.";
      default:
        return "로그인 중 오류가 발생했습니다.";
    }
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
        <h1>오류 발생</h1>
        <p className={styles.errorMessage}>{getErrorMessage(error)}</p>
        <button
          className={styles.googleButton}
          onClick={() => router.push("/auth/signin")}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
