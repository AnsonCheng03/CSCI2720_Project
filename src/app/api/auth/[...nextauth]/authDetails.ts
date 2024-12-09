import {
  checkNoOfAdmins,
  createUsers,
  userLogin,
} from "@/app/DatabaseProvider/Mutation/User";
import bcrypt from "bcrypt-nodejs";
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

        const user = JSON.parse(await userLogin(credentials));
        if (user.error) {
          const adminCount = JSON.parse(await checkNoOfAdmins());
          if (adminCount.error) {
            return null;
          }
          if (
            credentials.username === "admin" &&
            credentials.password === "admin" &&
            adminCount === 0
          ) {
            await createUsers({
              userName: credentials.username,
              password: bcrypt.hashSync(
                credentials.password,
                bcrypt.genSaltSync(8)
              ),
              role: "admin",
            });
            const user = JSON.parse(await userLogin(credentials));
            if (user.error) {
              return null;
            }
            return {
              id: user._id,
              name: user.userName,
              role: user.role,
            } as any;
          }
          return null;
        }

        return {
          id: user._id,
          name: user.userName,
          role: user.role,
        } as any;
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
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/", // Error code passed in query string as ?error=
  },
} as any;
