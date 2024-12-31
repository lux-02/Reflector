import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/contexts/LocaleContext";
import Analytics from "@/components/GoogleAnalytics";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <LocaleProvider>
        <Component {...pageProps} />
        <Analytics />
      </LocaleProvider>
    </SessionProvider>
  );
}
