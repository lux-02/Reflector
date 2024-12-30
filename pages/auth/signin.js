import { signIn } from "next-auth/react";
import styles from "@/styles/Auth.module.css";

export default function SignIn() {
  return (
    <div className={styles.container}>
      <div className={styles.signInBox}>
        <h1>Reflector</h1>
        <p>나를 돌아보는 시간</p>
        <button
          className={styles.googleButton}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Google로 시작하기
        </button>
      </div>
    </div>
  );
}
