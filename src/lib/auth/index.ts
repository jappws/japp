import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Connexion",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await axios.post(`${process.env.NEXTAUTH_URL}/api/v1/login/email`, {
          email: credentials?.email,
          password: credentials?.password,
        });
        // const res = await fetch(`https://ptpt.app/api/v1/login/email`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     email: credentials?.email,
        //     password: credentials?.password,
        //   }),
        // });

        // const user = await res.json();
        const user = res.data;

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
