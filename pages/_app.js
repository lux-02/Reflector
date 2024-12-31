import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/contexts/LocaleContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <LocaleProvider>
        <Component {...pageProps} />
      </LocaleProvider>
    </SessionProvider>
  );
}
