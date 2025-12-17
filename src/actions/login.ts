"use server"

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthFormState } from "@/types/auth";
import { loginUserSchemeForm } from "@/validations/auth-validation";
import { AuthError } from "next-auth";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null
) {
  const validatedFields = loginUserSchemeForm.safeParse({
    email: formData?.get("email"),
    password: formData?.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            errors: {
              description: ["Credentials not match"],
            },
          };
        default:
          return {
            status: "error",
            errors: {
              description: ["Something went wrong!"],
            },
          };
      }
    }

    throw error
  }

  return {
    status: "success",
  };
}
