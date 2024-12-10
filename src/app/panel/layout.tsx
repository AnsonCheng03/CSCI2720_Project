import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";
import { redirect } from "next/navigation";
import EventProvider from "./EventProvider/context";
import NavBar from "@/components/navBar/navBar";

import { FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { TiLightbulb } from "react-icons/ti";
import { RiAdminFill } from "react-icons/ri";

import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const userNavItems = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "List of Locations", href: "/panel", icon: <FaLocationDot /> },
  { name: "List of Events", href: "/panel/events", icon: <MdEvent /> },
  { name: "Map", href: "/panel/map", icon: <FaMapMarkedAlt /> },
  { name: "Favourites", href: "/panel/favorite", icon: <MdFavorite /> },
  { name: "No Idea?", href: "/panel/noidea", icon: <TiLightbulb /> },
];

const adminNavItems = [
  {
    name: "Manage Database",
    href: "/panel/admin",
    icon: <RiAdminFill />,
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionPromise = (await getServerSession(authOptions)) as {
    user?: {
      name: string;
      role?: string;
    };
  };

  if (!sessionPromise) redirect("/");
  const userRole = sessionPromise.user?.role;
  if (userRole !== "user" && userRole !== "admin") redirect("/panel");

  return (
    <EventProvider data={null} session={sessionPromise}>
      {
        <>
          <NavBar
            navItems={[
              ...userNavItems,
              ...((userRole === "admin" && adminNavItems) || []),
            ]}
            navFooterItems={[
              {
                name: sessionPromise.user?.name || "User",
                icon: <FaRegUserCircle />,
              },
              {
                name: "Sign out",
                href: "/api/auth/signout",
                icon: <IoLogOut />,
              },
            ]}
          />
          {children}
        </>
      }
    </EventProvider>
  );
}
