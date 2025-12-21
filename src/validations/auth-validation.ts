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

export const createLinkSchemeForm = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  key: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9_-]+$/.test(val),
      "Key can only contain alphanumeric characters, hyphens, and underscores."
    ),
});

export const updateLinkSchemeForm = z.object({

  id: z.string().min(1),

  url: z.string().url().optional(),

  title: z.string().optional(),

  description: z.string().optional(),

});



export type RegisterForm = z.infer<typeof registerUserSchemeForm>

export type LoginForm = z.infer<typeof loginUserSchemeForm>

export type CreateLinkForm = z.infer<typeof createLinkSchemeForm>

export type UpdateLinkForm = z.infer<typeof updateLinkSchemeForm>
