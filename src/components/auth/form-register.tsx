"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  RegisterForm,
  registerUserSchemeForm,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { register } from "@/actions/register";
import { INITIAL_STATE_REGISTER_FORM } from "@/constants/register-constant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterFormView() {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerUserSchemeForm),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const [regState, regAction, isPendingAction] = useActionState(
    register,
    INITIAL_STATE_REGISTER_FORM
  );
  const onSubmit = form.handleSubmit(async (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      form.append(key, value);
    });
    startTransition(() => {
      regAction(form);
    });
  });

  useEffect(() => {
    if (regState?.status === "error") {
      toast.error("Error register User", {
        description: regState?.errors?.description,
      });
    }

    if (regState?.status === "success") {
      toast.success("Success create user");
      form.reset();
    }
  }, [regState]);

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle> Register User</CardTitle>
        <CardDescription>Register your data here</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className=" space-y-4">
            <FormField
              control={form.control}
              name="email"
              disabled={isPendingAction}
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
            <FormField
              control={form.control}
              name="name"
              disabled={isPendingAction}
              render={({ field: { ...rest } }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...rest} placeholder="Your Name" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isPendingAction}
              render={({ field: { ...rest } }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...rest} type="password" placeholder="*********" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default">
              {isPendingAction ? (
                <Loader2 className=" animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
// export default function LoginForm() {
//   return (
//     <div className="flex flex-col space-y-5">
//       <div className="text-center">Login Page</div>
//       <Button
//         onClick={async () => {
//           "use server";
//           await signIn("google", { redirectTo: "/dashboard" });
//         }}
//       >
//         Login with Google{" "}
//       </Button>
//       <Button
//         onClick={async () => {
//           "use server";
//           await signIn("auth0", { redirectTo: "/dashboard" });
//         }}
//       >
//         Login with AryaLogin{" "}
//       </Button>
//       <Button
//         onClick={async () => {
//           "use server";
//           await signIn("twitter", { redirectTo: "/dashboard" });
//         }}
//       >
//         Login with X{" "}
//       </Button>
//       <Button
//         onClick={async () => {
//           "use server";
//           await signIn("discord", { redirectTo: "/dashboard" });
//         }}
//       >
//         Login with Discord{" "}
//       </Button>
//     </div>
//   );
// }
