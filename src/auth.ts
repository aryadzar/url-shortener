import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: "ADMIN" | "USER";
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: "ADMIN" | "USER";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = process.env.AUTH_GOOGLE_MAIL;

      if (!allowedEmail) return false;

      // hanya email yang diizinkan
      if (user.email !== allowedEmail) {
        return false;
      }

      return true;
    },

    async session({ session, user }) {
      // console.log(session);
      // session.user.name = user.name;
      // session.user.email = user.email;
      // session.user.image = user.image;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  ...authConfig,
});
