import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/contexts/LocaleContext";
import GoogleTagManager from "@/components/GoogleTagManager";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.dataLayer?.push({
        event: "pageview",
        page: url,
      });
      trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, trackPageView]);

  return (
    <SessionProvider session={session}>
      <LocaleProvider>
        <GoogleTagManager />
        <Component {...pageProps} />
      </LocaleProvider>
    </SessionProvider>
  );
}
