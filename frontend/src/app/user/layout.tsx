import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";
import { redirect } from "next/navigation";
import EventProvider from "./context";
import NavBar from "@/components/navBar/navBar";

export const userNavItems = [
  { name: "Home", href: "/" },
  { name: "List of Locations", href: "/user" },
  { name: "List of Events", href: "/user/events" },
  { name: "Map", href: "/user/map" },
  { name: "Favorite", href: "/user/favorite" },
  { name: "No Idea?", href: "/user/noidea" },
  { name: "Logout", href: "/api/auth/signout" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionPromise = (await getServerSession(authOptions)) as {
    user?: { role?: string };
  };
  if (!sessionPromise) redirect("/");
  const userRole = sessionPromise.user?.role;
  if (userRole !== "user") redirect("/admin");

  return (
    <EventProvider data={{}}>
      {
        <>
          <NavBar navItems={userNavItems} />
          {children}
        </>
      }
    </EventProvider>
  );
}
