import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";
import { redirect } from "next/navigation";
import NavBar from "@/components/navBar/navBar";
import { Box, Tab, Tabs } from "@mui/material";
import Link from "next/link";

const navItems = [
  { name: "Download Event", href: "/panel/admin" },
  { name: "New Event", href: "/panel/admin/newEvent" },
  { name: "Modify Event", href: "/panel/admin/modifyEvent" },
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

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs aria-label="basic tabs example">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Tab key={index} label={item.name} {...a11yProps(index)} />
            </Link>
          ))}
        </Tabs>
      </Box>
      {children}
    </Box>
  );
}
