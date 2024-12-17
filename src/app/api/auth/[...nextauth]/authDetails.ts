import bcrypt from "bcrypt-nodejs";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  checkNoOfAdmins,
  createUsers,
  userLogin,
} from "@/app/DatabaseProvider/Mutation/User";
import { handleVenueData } from "@/app/DatabaseProvider/Mutation/Venue";
import { downloadVenueData } from "@/app/panel/EventProvider/downloadVenueData";
import { uploadData } from "@/app/DatabaseProvider/Mutation/Event";

async function initDatabase() {
  try {
    const venue = await downloadVenueData();

    const handleServerSideVenueDataResponse = JSON.parse(
      await handleVenueData(JSON.parse(venue))
    );

    const outputVenue = handleServerSideVenueDataResponse.error
      ? JSON.parse(venue)
      : [
          ...(handleServerSideVenueDataResponse.updated || []),
          ...(handleServerSideVenueDataResponse.inserted || []),
          ...(handleServerSideVenueDataResponse.downloaded || []),
        ];

    const randomVenues = outputVenue
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 3)
      .map((venue: any) => venue["@_id"]);

    const events = randomVenues.map((venueId: string, index: number) => {
      const range = Array.from(
        { length: Math.floor(Math.random() * 3) + 3 },
        (_, i) => i
      );
      return range.map((i) => {
        return {
          "@_id": `event${index}-${i}`,
          titlee: `Event ${index}-${i}`,
          venueid: venueId,
          predateE: new Date().toISOString(),
          desce: `Initial event ${index}-${i}`,
        };
      });
    });

    await Promise.all(
      events.map((event: any) => {
        return Promise.all(
          event.map(async (e: any) => {
            const newEvent = JSON.parse(await uploadData(e));
            if (newEvent.error) {
              console.error(newEvent.message);
              return null;
            }
            return newEvent;
          })
        );
      })
    );

    await createUsers({
      userName: "admin",
      password: bcrypt.hashSync("admin", bcrypt.genSaltSync(8)),
      role: "admin",
    });
  } catch (e) {
    console.error(e);
  }
}

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = JSON.parse(await userLogin(credentials));
        if (user.error) {
          const adminCount = JSON.parse(await checkNoOfAdmins());
          if (adminCount.error) {
            return null;
          }
          await initDatabase();

          if (
            credentials.username === "admin" &&
            credentials.password === "admin" &&
            adminCount === 0
          ) {
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
