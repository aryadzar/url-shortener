import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import Auth0 from "next-auth/providers/auth0";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { loginUserSchemeForm } from "./validations/auth-validation";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
import Line from "next-auth/providers/line"
export default {
  providers: [
    Google,
    Twitter,
    Auth0,
    Discord,
    Line,
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginUserSchemeForm.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
            const user = await getUserByEmail(email)
            if(!user || !user.password) return null

            const passwordMatch = await bcrypt.compare(password, user.password )
            if (passwordMatch)return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig;
