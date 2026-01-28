"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react";

type Props = {
  keyProp: string;
  targetUrl: string;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turnstile: any;
  }
}

export default function RedirectPage({ keyProp, targetUrl }: Props) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Declare turnstile on window

    // Set up global callbacks for Turnstile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).handleTurnstileSuccess = (token: string) => {
      handleTurnstileSuccess(token);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).handleTurnstileError = () => {
      handleTurnstileError();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).handleTurnstileExpire = () => {
      handleTurnstileExpire();
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).handleTurnstileSuccess;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).handleTurnstileError;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).handleTurnstileExpire;
    };
  }, []);

  useEffect(() => {
    if (turnstileToken && isVerifying) {
      verifyAndRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnstileToken]);

  const verifyAndRedirect = async () => {
    try {
      const res = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: turnstileToken, key: keyProp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setIsVerifying(false);

      // Redirect immediately after successful verification
      window.location.href = targetUrl;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      setIsVerifying(false);
    }
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setError("Verification failed. Please try again.");
    setIsVerifying(false);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
    if (turnstileRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).turnstile?.reset(turnstileRef.current);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="text-center space-y-4">
          {isVerifying && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Security Check</CardTitle>
                <CardDescription>
                  Please complete the security check to continue
                </CardDescription>
              </div>
            </>
          )}
          {error && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Verification Failed</CardTitle>
                <CardDescription>{error}</CardDescription>
              </div>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isVerifying && (
            <>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <p className="text-xs text-muted-foreground mb-1">
                  Redirecting to:
                </p>
                <p className="text-sm text-primary break-all font-medium">
                  {targetUrl}
                </p>
              </div>

              <div className="flex justify-center py-4">
                <div
                  ref={turnstileRef}
                  className="cf-turnstile"
                  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  data-callback="handleTurnstileSuccess"
                  data-error-callback="handleTurnstileError"
                  data-expired-callback="handleTurnstileExpire"
                />
              </div>
            </>
          )}

          {!isVerifying && (
            <div className="bg-muted/50 rounded-lg p-4 border">
              <p className="text-xs text-muted-foreground mb-1">
                Redirecting to:
              </p>
              <p className="text-sm text-primary break-all font-medium">
                {targetUrl}
              </p>
            </div>
          )}

          {error && (
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          )}
        </CardContent>

        {!isVerifying && (
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => (window.location.href = targetUrl)}
              className="w-full sm:w-auto gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Redirect Now
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full sm:w-auto gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
