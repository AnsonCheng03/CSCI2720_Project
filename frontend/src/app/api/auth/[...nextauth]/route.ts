import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;
        if (
          credentials.username === "admin" &&
          credentials.password === "admin"
        ) {
          return {
            id: "1",
            name: "Admin",
            role: "admin",
          } as any;
        }

        if (
          credentials.username === "user" &&
          credentials.password === "user"
        ) {
          return {
            id: "2",
            name: "User",
            role: "user",
          } as any;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }: any) {
      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
