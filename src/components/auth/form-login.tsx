"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { LoginForm, loginUserSchemeForm } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login } from "@/actions/login";
import { INITIAL_STATE_LOGIN_FORM } from "@/constants/register-constant";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function LoginFormView() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginUserSchemeForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  async function handleLogin(provider: string) {
    try {
      setLoadingProvider(provider);
      await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
    } finally {
      setLoadingProvider(null);
    }
  }
  const [loginState, loginAction, isPendingLoginAction] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM
  );
  const onSubmit = form.handleSubmit(async (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      form.append(key, value);
    });
    startTransition(() => {
      loginAction(form);
    });
  });

  useEffect(() => {
    if (loginState?.status === "error") {
      toast.error("Error login User", {
        description: loginState?.errors?.description,
      });
    }

    if (loginState?.status === "success") {
      toast.success("Success login user");
      form.reset();
    }
  }, [loginState]);
  return (
    <div className="flex flex-col space-y-6 w-[350px]">
      <div className="text-center text-xl font-semibold">Login Page</div>

      {/* === Email & Password Login === */}
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <div>
            <FormField
              control={form.control}
              name="email"
              disabled={isPendingLoginAction}
              render={({ field: { ...rest } }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...rest} placeholder="Your Email" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="password"
              disabled={isPendingLoginAction}
              render={({ field: { ...rest } }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...rest}
                      type="password"
                      placeholder="************"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPendingLoginAction}>
            {isPendingLoginAction ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      {/* === Divider === */}
      <div className="flex items-center">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-2 text-sm text-gray-500">atau</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* === Oauth Buttons === */}
      <div className="flex flex-col space-y-3">
        <Button
          variant="outline"
          disabled={loadingProvider === "google"}
          onClick={() => handleLogin("google")}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Login with Google
        </Button>

        <Button
          variant="outline"
          disabled={loadingProvider === "auth0"}
          onClick={() => handleLogin("auth0")}
        >
          {loadingProvider === "auth0" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Login with AryaLogin
        </Button>

        <Button
          variant="outline"
          disabled={loadingProvider === "twitter"}
          onClick={() => handleLogin("twitter")}
        >
          {loadingProvider === "twitter" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Login with X
        </Button>

        <Button
          variant="outline"
          disabled={loadingProvider === "discord"}
          onClick={() => handleLogin("discord")}
        >
          {loadingProvider === "discord" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Login with Discord
        </Button>
        <Button
          variant="outline"
          disabled={loadingProvider === "line"}
          onClick={() => handleLogin("line")}
        >
          {loadingProvider === "line" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Login with Line
        </Button>
      </div>
    </div>
  );
}
