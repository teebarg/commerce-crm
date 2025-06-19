import { handlers } from "@/server/auth";
import NextAuth from "next-auth";
import { authConfig } from "@/server/auth/config";

export const { GET, POST } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/signin",
  },
});
