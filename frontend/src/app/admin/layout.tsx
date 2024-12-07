import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionPromise = (await getServerSession(authOptions)) as {
    user?: { role?: string };
  };
  const userRole = sessionPromise?.user?.role;
  if (userRole !== "admin") {
    return <div>Unauthorized</div>;
  }

  return children;
}
