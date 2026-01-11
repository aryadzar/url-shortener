import { Metadata } from "next";
import AnalyticsPageClient from "./_components/analytics";

export const metadata: Metadata = {
  title: "Analytics",
  description: "View detailed analytics for your links",
};

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}
