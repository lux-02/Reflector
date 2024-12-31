import { signIn } from "next-auth/react";
import styles from "@/styles/Auth.module.css";
import Image from "next/image";

export default function SignIn() {
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
        <h1>Reflector</h1>
        <p>
          Reflect. Renew. Rise. <br />
          Illuminate Your Tomorrow.
        </p>
        <button
          className={styles.googleButton}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Log in with Google
        </button>
      </div>
    </div>
  );
}
