import { GoogleAnalytics } from "@next/third-parties/google";

export default function Analytics() {
  return process.env.NEXT_PUBLIC_GA_ID ? (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
  ) : null;
}
