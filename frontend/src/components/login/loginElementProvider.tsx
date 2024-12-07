import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/authDetails";

import { LoginProviderElement } from "./context";
import { LoginBtn } from "./loginBtn";

export default function loginElementProvider({
  element = <LoginBtn />,
}: {
  element?: React.ReactNode | React.ReactNode[] | null;
}) {
  const sessionPromise = getServerSession(authOptions);

  return (
    <LoginProviderElement sessionPromise={sessionPromise}>
      {element}
    </LoginProviderElement>
  );
}
