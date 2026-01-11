import { Metadata } from "next";
import DashboardPageClient from "./_components/dashboard";

export const metadata: Metadata = {
  title: "Links",
  description: "Manage your shortened URLs",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
