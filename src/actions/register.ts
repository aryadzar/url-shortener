"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { AuthFormState } from "@/types/auth";
import { registerUserSchemeForm } from "@/validations/auth-validation";
import bcrypt from "bcryptjs";

export async function register(
  prevState: AuthFormState,
  formData: FormData | null
) {
  const validatedFields = registerUserSchemeForm.safeParse({
    email: formData?.get("email"),
    name: formData?.get("name"),
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

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return {
      status: "error",
      errors: {
        description : ["Email already used"]
      }
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    status: "success",
  };
}
