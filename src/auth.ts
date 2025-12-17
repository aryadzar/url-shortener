import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";

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
    // async signIn({user}){
    //   const existingUser = await getUserById(user.id)

    //   if(!existingUser || !existingUser.emailVerified){
        
    //     return false
    //   }
    //   return true
    // },
    // async signIn({ user, account, profile, email }) {
    //   if (!user.email) return false

    //   // Cari user berdasarkan email
    //   const existingUser = await db.user.findUnique({
    //     where: { email: user.email },
    //   })

    //   if (existingUser) {
    //     // Kalau ada user dengan email yang sama, pastikan account OAuth terhubung
    //     const existingAccount = await db.account.findFirst({
    //       where: {
    //         provider: account?.provider,
    //         providerAccountId: account?.providerAccountId,
    //         userId: existingUser.id,
    //       },
    //     })

    //     if (!existingAccount && account) {
    //       await db.account.create({
    //         data: {
    //           userId: existingUser.id,
    //           type: account.type,
    //           provider: account.provider,
    //           providerAccountId: account.providerAccountId,
    //           access_token: account.access_token,
    //           refresh_token: account.refresh_token,
    //           expires_at: account.expires_at,
    //           token_type: account.token_type,
    //           scope: account.scope,
    //           id_token: account.id_token,
    //           session_state: account.session_state?.toString(),
    //         },
    //       })
    //     }
    //     return true
    //   }

    //   // Kalau user baru, Auth.js + PrismaAdapter otomatis bikin user & account
    //   return true
    // },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      // console.log(token)
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
