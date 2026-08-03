import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const usuariosPermitidos = (process.env.ALLOWED_USERS ?? "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile) return false;

      let identificador: string | undefined;

      if (account?.provider === "github") {
        identificador = (profile as { login?: string }).login?.toLowerCase();
      } else if (account?.provider === "google") {
        identificador = (profile as { email?: string }).email?.toLowerCase();
      }

      if (!identificador) return false;
      return usuariosPermitidos.includes(identificador);
    },
  },
};