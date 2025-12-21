import LoginFormView from "@/components/auth/form-login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your URL Shortener account",
};

export default function AuthPage() {
  return <LoginFormView />;
}
