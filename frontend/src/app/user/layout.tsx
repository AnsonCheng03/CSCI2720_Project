import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authDetails";
import { redirect } from "next/navigation";
import EventProvider from "./context";
import { XMLParser } from "fast-xml-parser";

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

  const parser = new XMLParser();

  const eventData = await fetch(
    "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml"
  )
    .then(async (res) => {
      // parse the XML response
      const data = await res.text();
      const jsonData = parser.parse(data);

      return [jsonData];
    })
    .catch(() => []);

  return <EventProvider data={eventData}>{children}</EventProvider>;
}
