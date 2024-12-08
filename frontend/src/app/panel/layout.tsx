import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";
import { redirect } from "next/navigation";
import EventProvider from "./context";
import NavBar from "@/components/navBar/navBar";

export const userNavItems = [
  { name: "Home", href: "/" },
  { name: "List of Locations", href: "/panel" },
  { name: "List of Events", href: "/panel/events" },
  { name: "Map", href: "/panel/map" },
  { name: "Favourites", href: "/panel/favorite" },
  { name: "No Idea?", href: "/panel/noidea" },
  { name: "Logout", href: "/api/auth/signout" },
];

export const adminNavItems = [
  { name: "Manage Database", href: "/panel/admin" },
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
  if (userRole !== "user" && userRole !== "admin") redirect("/panel");

  const heads = await headers();
  const pathname = heads.get("x-pathname");
  if (pathname?.startsWith("/panel/admin") && userRole !== "admin")
    redirect("/panel");

  return (
    <EventProvider data={{}}>
      {
        <>
          <NavBar
            navItems={[
              ...userNavItems,
              ...((userRole === "admin" && adminNavItems) || []),
            ]}
          />
          {children}
        </>
      }
    </EventProvider>
  );
}
