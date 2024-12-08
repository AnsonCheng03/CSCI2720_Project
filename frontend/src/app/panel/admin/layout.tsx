import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";
import { redirect } from "next/navigation";
import EventProvider from "./context";
import NavBar from "@/components/navBar/navBar";

export const navItems = [
  { name: "New Event", href: "/panel/admin" },
  { name: "Download Event", href: "/panel/admin/downloadEvent" },
  { name: "Create Users", href: "/panel/admin/createUsers" },
  { name: "Modify Users", href: "/panel/admin/modifyUsers" },
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
  if (userRole !== "admin") redirect("/panel");

  return (
    <>
      <NavBar navItems={navItems} />
      {children}
    </>
  );
}
