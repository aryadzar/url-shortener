import z from "zod";

export const registerUserSchemeForm = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export const loginUserSchemeForm = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters",
  })
});

export type RegisterForm = z.infer<typeof registerUserSchemeForm>
export type LoginForm = z.infer<typeof loginUserSchemeForm>