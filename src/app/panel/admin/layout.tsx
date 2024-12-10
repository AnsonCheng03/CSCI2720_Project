import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Box, Tab, Tabs } from "@mui/material";
import styles from "./layout.module.css";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";

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
    <div className={styles.page}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs aria-label="basic tabs example" className={styles.tabs}>
            {navItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Tab key={index} label={item.name} {...a11yProps(index)} />
              </Link>
            ))}
          </Tabs>
        </Box>
        {children}
      </Box>
    </div>
  );
}
