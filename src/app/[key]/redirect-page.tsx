"use client";

import { useEffect, useState } from "react";
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
import { ExternalLink, ArrowLeft } from "lucide-react";

type Props = {
  url: string;
};

export default function RedirectPage({ url }: Props) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [url]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <ExternalLink className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Redirecting...</CardTitle>
            <CardDescription>
              You will be redirected in{" "}
              <span className="font-semibold text-foreground">
                {countdown}
              </span>{" "}
              seconds
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-xs text-muted-foreground mb-1">Destination:</p>
            <p className="text-sm text-primary break-all font-medium">{url}</p>
          </div>

          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "0.6s",
                }}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => (window.location.href = url)}
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
      </Card>
    </div>
  );
}
