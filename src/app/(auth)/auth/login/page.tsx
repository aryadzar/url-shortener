import LoginFormView from "@/components/auth/form-login";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your URL Shortener account",
};

export default function AuthPage() {
  return (
    <>
      <Suspense fallback={<>...</>}>
        <LoginFormView />
      </Suspense>
    </>
  );
}
