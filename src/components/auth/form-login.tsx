"use client";

import { Button } from "../ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export default function LoginFormView() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  async function handleLogin(provider: string) {
    try {
      setLoadingProvider(provider);

      await signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
      });
    } finally {
      setLoadingProvider(null);
    }
  }

  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error) return;

    if (error === "AccessDenied") {
      toast.error("Email Google ini tidak diizinkan");
    } else if (error === "OAuthAccountNotLinked") {
      toast.error("Akun Google ini sudah terhubung dengan provider lain");
    } else {
      toast.error("Gagal login, silakan coba lagi");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col space-y-6 w-[350px]">
      <div className="text-center text-xl font-semibold">Login Page</div>
      {/* === Oauth Buttons === */}
      <div className="flex flex-col space-y-3">
        <Button
          variant="outline"
          className="cursor-pointer flex items-center gap-2"
          disabled={loadingProvider === "google"}
          onClick={() => handleLogin("google")}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.2 0 5.4 1.4 6.6 2.5l4.9-4.9C32.6 4.3 28.7 2.5 24 2.5 14.9 2.5 7.1 8.1 3.9 16.1l5.8 4.5C11.2 14.4 17.1 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.7c-.5 2.8-2.4 6.9-6.7 9.7l5.2 4C40.2 37.2 46.5 31.8 46.5 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M9.7 28.6c-.4-1.1-.6-2.3-.6-3.6s.2-2.5.6-3.6l-5.8-4.5C2.4 19.7 1.5 22.7 1.5 25s.9 5.3 2.4 7.6l5.8-4z"
              />
              <path
                fill="#34A853"
                d="M24 46.5c6.5 0 12-2.1 16-5.7l-5.2-4c-2.8 1.9-6.5 3.2-10.8 3.2-6.9 0-12.8-4.9-14.9-11.4l-5.8 4C7.1 40.4 14.9 46.5 24 46.5z"
              />
            </svg>
          )}
          <span>Login with Google</span>
        </Button>
      </div>
    </div>
  );
}
